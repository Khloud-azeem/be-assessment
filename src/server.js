import express from "express";
import authRoutes from "./middlewares/auth";
import checksRoutes from "./handlers/checks";
import reportsRoutes from "./handlers/reports";
import bodyParser from "body-parser";
import connectDB from "../config/db";
import { Cron } from "./services/cron";

const app = express();
const port = 3000;

app.use(bodyParser.json());

connectDB();

const cron = new Cron();
cron.startCheck();

app.get("/api", (_req, res) => {
  res.send("App started");
});
authRoutes(app);
checksRoutes(app);
reportsRoutes(app);

app.listen(port, () => {
  console.log(`Server started at localhost: ${port}`);
});

export default app;
