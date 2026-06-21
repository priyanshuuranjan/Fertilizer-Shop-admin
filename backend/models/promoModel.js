import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percent", "flat"], required: true },
  discountValue: { type: Number, required: true },
  // For percent codes: optional cap on the rupee discount (0 = no cap)
  maxDiscount: { type: Number, default: 0 },
  // Code only valid when subtotal >= this (0 = no minimum)
  minOrderAmount: { type: Number, default: 0 },
  // Optional expiry; null = never expires
  expiresAt: { type: Date, default: null },
  active: { type: Boolean, default: true },
  // User IDs that have already redeemed this code (once-per-account)
  usedBy: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
});

const promoModel =
  mongoose.models.promo || mongoose.model("promo", promoSchema);
export default promoModel;
