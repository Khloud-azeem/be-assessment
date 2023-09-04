import cron from "node-cron";
import axios from "axios";

import { CheckStore } from "../models/check";
import { ReportStore } from "../models/report";
import { UserStore } from "../models/user";
import sendEmail from "./email";

const checkStore = new CheckStore();
const reportStore = new ReportStore();
const userStore = new UserStore();

export class Cron {
  //array of working cron tasks
  static cronTasks = {};

  async checkUrl(check) {
    try {
      const report = await reportStore.create(check.id);
      let endTime, responseTime, response;
      const timeout = check.timeout;
      const url = check.url + check.path;
      const webhook = check.webhook;
      const user = await userStore.getById(check.user_id);
      const startTime = Date.now();
      const poll = async (timeout) => {
        response = axios
          .request({
            url: url,
            method: "GET",
            timeout: timeout,
          })
          .then(async (result) => {
            endTime = Date.now();
            responseTime = (endTime - startTime) / 1000;
            report.response_time = responseTime;
            report.uptime += responseTime;
            report.status = result.status;
            report.availability =
              (report.uptime / (report.uptime + report.downtime)) * 100;
            report.history.push({
              time_stamp: Date.now(),
              data: {
                url: url,
                uptime: report.uptime,
                downtime: report.downtime,
                response_time: report.response_time,
                status: report.status,
                outages: report.outages,
                availability: report.availability,
              },
            });
            if (report.outages > 0) {
              if (webhook)
                sendEmail(
                  [webhook, user.email],
                  `URL Up Alert`,
                  `URL: ${url} went up again.`,
                );
              else
                sendEmail(
                  user.email,
                  `URL Up Alert`,
                  `URL: ${url} went up again.`,
                );
            }
            await reportStore.update(report, check.id);
            console.log(
              "name",
              check.name,
              "responseTime ",
              responseTime,
              "uptime",
              report.uptime,
              "downtime",
              report.downtime,
              "status",
              report.status,
              "outages",
              report.outages,
            );
          })
          .catch(async (error) => {
            endTime = Date.now();
            responseTime = (endTime - startTime) / 1000;
            report.response_time = responseTime;
            report.downtime += responseTime;
            report.outages++;
            report.status = error.response.status;
            report.availability =
              (report.uptime / (report.uptime + report.downtime)) * 100;
            report.history.push({
              time_stamp: Date.now(),
              data: {
                url: url,
                uptime: report.uptime,
                downtime: report.downtime,
                response_time: report.response_time,
                status: report.status,
                outages: report.outages,
                availability: report.availability,
              },
            });
            await reportStore.update(report, check.id);
            if (webhook)
              sendEmail(
                [webhook, user.email],
                `URL Down Alert`,
                `URL: ${url} went down.`,
              );
            else
              sendEmail(user.email, `URL Down Alert`, `URL: ${url} went down.`);
            console.log(
              "name",
              check.name,
              "responseTime ",
              responseTime,
              "uptime",
              report.uptime,
              "downtime",
              report.downtime,
              "status",
              report.status,
              "outages",
              report.outages,
            );
            if (Date.now() - startTime < timeout) {
              let remainingTimeout = timeout - (Date.now() - startTime);
              poll(remainingTimeout);
            }
          });
      };
      poll(timeout);
      return {
        message: "Checked",
      };
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //starts checking all tasks in tasks array
  async startCheck() {
    try {
      const checks = await checkStore.getAll();
      checks.forEach((check) => {
        cron.schedule(`*/${check.interval} * * * *`, () => {
          this.checkUrl(check);
        });
      });
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //adds new task
  async addCheck(check) {
    try {
      Cron.cronTasks[check._id] = cron.schedule(
        `*/${check.interval} * * * *`,
        () => {
          this.checkUrl(check);
        },
      );
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //stops working task
  async removeCheck(check) {
    try {
      Cron.cronTasks[check._id].stop();
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
