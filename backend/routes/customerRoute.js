import express from "express";
import { listCustomers } from "../controllers/customerController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const customerRouter = express.Router();
customerRouter.get("/list", verifyAdmin, listCustomers);

export default customerRouter;
