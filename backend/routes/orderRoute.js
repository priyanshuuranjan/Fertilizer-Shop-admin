import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  exportOrders,
} from "../controllers/orderController.js";
import { validate, placeOrderRules } from "../middleware/validate.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrderRules, validate, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.get("/export", exportOrders);

export default orderRouter;
