import express from "express";
import {
  addProduct,
  listProduct,
  searchProducts,
  updateStock,
  updatePrice,
  removeProduct,
  bulkRemoveProducts,
} from "../controllers/productController.js";
import multer from "multer";
import { validate, productRules } from "../middleware/validate.js";
import { verifyAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";

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
// /list and /search stay public — the customer storefront reads them too.
productRouter.post("/add", verifyAdmin, upload.single("image"), productRules, validate, addProduct);
productRouter.get("/list", listProduct);
productRouter.get("/search", searchProducts);
productRouter.post("/update-stock", verifyAdmin, updateStock);
productRouter.post("/update-price", verifyAdmin, updatePrice);
// Deleting products is Super Admin only — Staff can add/edit but not remove.
productRouter.post("/remove", verifyAdmin, requireSuperAdmin, removeProduct);
productRouter.post("/bulk-remove", verifyAdmin, requireSuperAdmin, bulkRemoveProducts);

export default productRouter;
