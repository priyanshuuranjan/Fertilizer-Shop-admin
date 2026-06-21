import express from "express";
import {
  applyPromo,
  createPromo,
  listPromos,
  removePromo,
  togglePromo,
} from "../controllers/promoController.js";

const promoRouter = express.Router();

// user
promoRouter.post("/apply", applyPromo);

// admin
promoRouter.post("/create", createPromo);
promoRouter.get("/list", listPromos);
promoRouter.post("/remove", removePromo);
promoRouter.post("/toggle", togglePromo);

export default promoRouter;
