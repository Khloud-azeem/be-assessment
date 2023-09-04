import User from "../schemas/user";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export class UserStore {
  async getById(id) {
    try {
      id = new ObjectId(id);
      const user = await User.findOne({
        _id: id,
      });
      return user;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getByUsername(username) {
    try {
      const user = await User.findOne({
        user_name: username,
      });
      return user;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async create(user) {
    try {
      const currentUser = await User.findOne({
        user_name: user.user_name,
      });
      if (currentUser) {
        return null;
      }
      const res = new User({
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        hashed_password: user.hashed_password,
      });
      await res.save();
      return res;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async update(user) {
    try {
      const currentUser = await User.findOneAndUpdate(
        {
          user_name: user.user_name,
        },
        user,
      );
      return {
        message: "updated",
      };
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
