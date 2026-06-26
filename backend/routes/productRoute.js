import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  bulkRemoveProducts,
} from "../controllers/productController.js";
import multer from "multer";
import { validate, productRules } from "../middleware/validate.js";

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
productRouter.post("/add", upload.single("image"), productRules, validate, addProduct);
productRouter.get("/list", listProduct);
productRouter.post("/remove", removeProduct);
productRouter.post("/bulk-remove", bulkRemoveProducts);

export default productRouter;
