import Report from "../schemas/report";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export class ReportStore {
  //get a report by report id
  async get(id) {
    try {
      id = new ObjectId(id);
      const report = await Report.find({
        _id: id,
      });
      return report;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //get the report associated with the right check from the input array
  async getByCheckId(checkIds) {
    try {
      const reports = await Report.find({
        check_id: { $in: checkIds },
      });
      return reports;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //create a new empty report associated with a check
  async create(checkId) {
    try {
      const currentReport = await Report.findOne({
        check_id: checkId,
      });
      if (currentReport) {
        return currentReport;
      }
      const res = new Report({
        check_id: checkId,
      });
      await res.save();
      return res;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //update report with updated check data
  async update(report, checkId) {
    try {
      await Report.findOneAndUpdate(
        {
          check_id: checkId,
        },
        report,
      );
      return {
        message: "updated",
      };
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
