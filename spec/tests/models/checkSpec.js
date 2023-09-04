import { UserStore } from "../../models/user";
import { CheckStore } from "../../models/check";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { ObjectId } = mongoose.Types;
const userStore = new UserStore();
const checkStore = new CheckStore();

//performed some of the possible test cases, not all
describe("models/checks endpoint", () => {
  let token;
  const user = {
    user_name: "khloud",
    password: "password123",
  };
  beforeAll(async () => {
    //log user in and store token
    token = jwt.sign(
      {
        user_name: user.user_name,
        password: user.password,
      },
      process.env.TOKEN_SECRET,
    );
  });

  describe("create", () => {
    const check = {
      name: "test-check",
      url: "http://127.0.0.1:3000/api",
      protocol: "HTTPS",
    };
    it("should create new check associated with an existed user and return a JSON response", async () => {
      const response = await checkStore.create(check);
      const saltRounds = process.env.SALT_ROUNDS;
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        parseInt(saltRounds),
      );
      const currentUser = await userStore.getByUsername(user.user_name);
      expect(result).toEqual({
        user_id: ObjectId(currentUser._id),
        name: "test-check",
        url: "http://127.0.0.1:3000/api",
        protocol: "HTTPS",
        path: "/",
        port: null,
        timeout: 5000,
        interval: 10,
        threshold: 1,
        authentication: {
          user_name: "khloud",
          password: hashedPassword,
        },
        http_headers: {
          user_name: "khloud",
          password: hashedPassword,
        },
        tags: [],
        ignore_ssl: false,
        _id: response._id, //generated automatically
        __v: 0,
      });
    });
  });
});
