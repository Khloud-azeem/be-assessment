import Check from "../schemas/check";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export class CheckStore {
  async getAll() {
    try {
      const checks = await Check.find();
      return checks;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getByUserId(userId) {
    try {
      userId = new ObjectId(userId);
      const checks = await Check.find({
        user_id: userId,
      });
      return checks;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getByTags(userId, tags) {
    try {
      userId = new ObjectId(userId);
      const checks = await Check.find({
        user_id: userId,
        tags: { $in: tags },
      });
      return checks;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getByName(name) {
    try {
      const check = await Check.findOne({
        name: name,
      });
      return check;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async create(check, userId) {
    try {
      userId = new ObjectId(userId);
      const currentCheck = await Check.findOne({
        name: check.name,
      });
      if (currentCheck) {
        return null;
      }
      const res = new Check({
        user_id: userId,
        name: check.name,
        url: check.url,
        protocol: check.protocol,
        path: check.path,
        webhook: check.webhook,
        interval: check.interval,
        threshold: check.threshold,
        authentication: check.authentication,
        http_headers: check.authentication,
        assert: check.assert,
        tags: check.tags,
        ignore_ssl: check.ignore_ssl,
      });
      await res.save();
      return res;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //update an existing check by its name and owner
  async updateByName(userId, check) {
    try {
      userId = new ObjectId(userId);
      const updatedCheck = await Check.findOneAndUpdate(
        {
          name: check.name,
          user_id: userId,
        },
        check,
      );
      return updatedCheck;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  //delete an existing check by its name
  async deleteByName(name) {
    try {
      const check = await Check.findOneAndDelete({
        name: name,
      });
      return check;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
