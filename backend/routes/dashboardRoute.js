import express from "express";
import {
  getDashboardStats,
  getSalesAnalytics,
} from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();
dashboardRouter.get("/stats", getDashboardStats);
dashboardRouter.get("/analytics", getSalesAnalytics);

export default dashboardRouter;
