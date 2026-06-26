import express from "express";
import { listCustomers } from "../controllers/customerController.js";

const customerRouter = express.Router();
customerRouter.get("/list", listCustomers);

export default customerRouter;
