import { Router } from "express";
import AnalyzerController from "./analyzer.controller.js";

const routes = Router();
const analyzerController = new AnalyzerController();

routes.get("/", (_, res) => {
  console.log("getting here");
  res.send("Hello from server!");
});

routes.post("/analyzer", analyzerController.analyze);

export default routes;
