import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { validate, registerRules, loginRules } from "../middleware/validate.js";

const userRouter = express.Router();

userRouter.post("/register", registerRules, validate, registerUser);
userRouter.post("/login", loginRules, validate, loginUser);

export default userRouter;
