import express from "express";
import {
  logAdvisorQuery,
  getAdvisorInsights,
} from "../controllers/advisorController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const advisorRouter = express.Router();

// user (anonymous — fired by the Crop Advisor after each calculation)
advisorRouter.post("/log", logAdvisorQuery);

// admin
advisorRouter.get("/insights", verifyAdmin, getAdvisorInsights);

export default advisorRouter;
