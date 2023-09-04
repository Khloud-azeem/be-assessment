import { UserStore } from "../models/user";
import sendEmail from "../services/email";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const userStore = new UserStore();

export class Auth {
  verifyToken(req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(" ")[1];
      req.headers.token = jwt.verify(token, process.env.TOKEN_SECRET);
      next();
    } catch (err) {
      res.status(401).send({
        message: "Unauthorized",
      });
    }
  }

  //log existing user in using username and password
  async login(req, res) {
    try {
      let user = await userStore.getByUsername(req.body.user_name);
      if (user === null) {
        res.status().json({
          message: "Can't log user in.",
        });
      } else {
        let isMatching = bcrypt.compareSync(
          req.body.password,
          user.hashed_password,
        );
        if (isMatching) {
          const token = jwt.sign(
            {
              user_name: user.user_name,
              password: user.hashed_password,
            },
            process.env.TOKEN_SECRET,
          );
          res.status(200).json(token);
        } else {
          res.status(400).json({
            message: "Can't log user in.",
          });
        }
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //create new user
  async signup(req, res) {
    try {
      //hashing input password
      const saltRounds = process.env.SALT_ROUNDS;
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        parseInt(saltRounds),
      );
      const verificationCode = Math.floor(
        Math.random() * (99999 - 10000 + 1) + 10000,
      );
      let userInput = {
        user_name: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        hashed_password: hashedPassword,
        verification_code: verificationCode,
      };
      const user = await userStore.create(userInput);
      if (user === null) {
        res.status(400).json({
          message: "User already created. Log in",
        });
      } else {
        sendEmail(
          user,
          "Verifiy your email address",
          `Use this code to verify your email address: ${user.verification_code}`,
        );
        return res.status(200).json({
          message: "A verification mail has been sent to your email address",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Error Ocuured",
      });
    }
  }

  //verify user email address
  async verifyEmail(req, res) {
    try {
      let user = await userStore.getByUsername(req.body.user_name);
      if (user.is_verified) {
        res.send(200).json({
          message: "User already verified",
        });
      } else {
        user.verification_code = req.body.verification_code;
        user.is_verified = true;
        await userStore.update(user);
        res.status(200).json({
          message: "Email Verified",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Error Ocuured",
      });
    }
  }

  // get user credentials {username, password} using token storerd in request headers
  async getCurrentAuthenticatedUser(req) {
    try {
      const authentication = req.headers.token;
      const user = await userStore.getByUsername(authentication.user_name);
      return user;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

const auth = new Auth();
const authRoutes = (app) => {
  app.post("/api/login", auth.login);
  app.post("/api/signup", auth.signup);
  app.post("/api/verify", auth.verifyEmail);
};
export default authRoutes;
