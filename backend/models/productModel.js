import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

// agr model phle se bna hoga to bar bar nhi banega or nhi bna rhga to bn jayega
const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
