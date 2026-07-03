import express from "express";
import {
  getDashboardStats,
  getSalesAnalytics,
} from "../controllers/dashboardController.js";
import { verifyAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";

const dashboardRouter = express.Router();
// Stats are shared (revenue fields redacted for Staff in the controller).
dashboardRouter.get("/stats", verifyAdmin, getDashboardStats);
// Analytics is pure revenue/sales data — Super Admin only.
dashboardRouter.get("/analytics", verifyAdmin, requireSuperAdmin, getSalesAnalytics);

export default dashboardRouter;
