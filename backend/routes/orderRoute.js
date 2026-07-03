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
import { downloadInvoice } from "../controllers/invoiceController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrderRules, validate, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
// Admin-only endpoints (Super Admin or Staff)
orderRouter.get("/list", verifyAdmin, listOrders);
orderRouter.post("/status", verifyAdmin, updateStatus);
orderRouter.get("/export", verifyAdmin, exportOrders);
// Invoice link is opened directly by the customer's browser (<a href>), no token to attach.
orderRouter.get("/invoice/:orderId", downloadInvoice);

export default orderRouter;
