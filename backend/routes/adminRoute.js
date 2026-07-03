import express from "express";
import { adminLogin, addStaff, listStaff, removeStaff } from "../controllers/adminController.js";
import { verifyAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";
import { validate, staffRules } from "../middleware/validate.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

// Staff management — Super Admin only
adminRouter.get("/staff/list", verifyAdmin, requireSuperAdmin, listStaff);
adminRouter.post("/staff/add", verifyAdmin, requireSuperAdmin, staffRules, validate, addStaff);
adminRouter.post("/staff/remove", verifyAdmin, requireSuperAdmin, removeStaff);

export default adminRouter;
