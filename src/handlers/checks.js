import { CheckStore } from "../models/check";
import { Auth } from "../middlewares/auth";
import { Cron } from "../services/cron";

const checkStore = new CheckStore();
const auth = new Auth();
const cron = new Cron();

//get all checks associated with a specific user
const getByUserId = async function (req, res) {
  try {
    const user = await auth.getCurrentAuthenticatedUser(req);
    const checks = await checkStore.getByUserId(user._id);
    return res.status(200).json(checks);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//create new check
const create = async function (req, res) {
  try {
    const user = await auth.getCurrentAuthenticatedUser(req);
    let checkInput = {
      name: req.body.name,
      url: req.body.url,
      protocol: req.body.protocol,
      path: req.body.path,
      port: req.body.port,
      webhook: req.body.webhook,
      interval: req.body.interval,
      threshold: req.body.threshold,
      authentication: {
        user_name: user.user_name,
        password: user.hashed_password,
      },
      http_headers: req.body.http_headers,
      assert: req.body.assert,
      tags: req.body.tags,
      ignore_ssl: req.body.ignore_ssl,
    };
    const check = await checkStore.create(checkInput, user._id);
    if (check === null) {
      res.status(400).json({
        message: "Check with this name is already created. Update it",
      });
    } else {
      cron.addCheck(check);
      return res.status(200).json(check);
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//update an existing check
const updateByName = async function (req, res) {
  try {
    const user = await auth.getCurrentAuthenticatedUser(req);
    const check = req.body.check;
    const updatedCheck = await checkStore.updateByName(user._id, check);
    if (updatedCheck === null) {
      res.status(400).json({
        message: "No such check",
      });
    } else {
      return res.json({
        message: "Updated successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//delete an existing check
const deleteByName = async function (req, res) {
  try {
    const check = await checkStore.deleteByName(req.body.check.name);
    if (check === null) {
      res.status(400).json({
        message: "No such check",
      });
    } else {
      await cron.removeCheck(check);
      res.status(200).json({
        message: "Deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const checksRoutes = (app) => {
  app.get("/api/checks", auth.verifyToken, getByUserId);
  app.post("/api/checks/create", auth.verifyToken, create);
  app.post("/api/checks/update", auth.verifyToken, updateByName);
  app.post("/api/checks/delete", auth.verifyToken, deleteByName);
};

export default checksRoutes;
