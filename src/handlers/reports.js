import { CheckStore } from "../models/check";
import { ReportStore } from "../models/report";
import { Auth } from "../middlewares/auth";

let checkStore = new CheckStore();
let reportStore = new ReportStore();
let auth = new Auth();

//get a report with report id
const get = async (req, res) => {
  try {
    const report = await reportStore.get(req.body.report_id);
    if (report === null) {
      res.status(400).json({
        message: "No such report",
      });
    } else {
      return res.status(200).json(report);
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//get reports for checks grouped by tags
const getByTags = async (req, res) => {
  try {
    const user = await auth.getCurrentAuthenticatedUser(req);
    const checks = await checkStore.getByTags(user._id, req.body.tags);
    if (checks === null) res.status(400).send("No such check");
    else {
      let checkIds = [];
      checks.forEach((check) => {
        checkIds.push(check._id);
      });
      if (checkIds.length == 0) return res.status(400).send("No reports found");
      else {
        const reports = await reportStore.getByCheckId(checkIds);
        if (reports === null)
          res.status(400).send({
            message: "No reports found",
          });
        else res.status(200).send(reports);
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const reportsRoutes = (app) => {
  app.post("/api/report", auth.verifyToken, get);
  app.post("/api/reports/getByTags", auth.verifyToken, getByTags);
};

export default reportsRoutes;
