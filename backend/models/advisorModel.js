import mongoose from "mongoose";

// One document per Crop Advisor consultation. The frontend logs every plan a
// farmer generates so the shop owner can see real demand (crops, budgets,
// problems) in the admin panel — no personal data is stored.
const advisorQuerySchema = new mongoose.Schema({
  mode: { type: String, enum: ["grow", "protect"], required: true },
  crop: { type: String, default: "", trim: true },
  problem: { type: String, default: "", trim: true },
  acres: { type: Number, default: 0, min: 0 },
  // 0 = farmer chose "no limit"
  budget: { type: Number, default: 0, min: 0 },
  // Full recommended plan cost vs what fit inside the budget
  fullCost: { type: Number, default: 0, min: 0 },
  planCost: { type: Number, default: 0, min: 0 },
  fitsBudget: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

const advisorModel =
  mongoose.models.advisorQuery ||
  mongoose.model("advisorQuery", advisorQuerySchema);
export default advisorModel;
