import express from "express";
import {
  applyPromo,
  createPromo,
  listPromos,
  removePromo,
  togglePromo,
} from "../controllers/promoController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const promoRouter = express.Router();

// user
promoRouter.post("/apply", applyPromo);

// admin
promoRouter.post("/create", verifyAdmin, createPromo);
promoRouter.get("/list", verifyAdmin, listPromos);
promoRouter.post("/remove", verifyAdmin, removePromo);
promoRouter.post("/toggle", verifyAdmin, togglePromo);

export default promoRouter;
