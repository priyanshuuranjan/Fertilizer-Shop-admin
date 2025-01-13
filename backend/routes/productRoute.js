import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
} from "../controllers/productController.js";
import multer from "multer";

// Image storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const productRouter = express.Router();

// Route to handle product upload (All routes are related to productController)
productRouter.post("/add", upload.single("image"), addProduct);
productRouter.get("/list", listProduct);
productRouter.post("/remove", removeProduct);

export default productRouter;
