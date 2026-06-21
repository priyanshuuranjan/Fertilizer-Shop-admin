import promoModel from "../models/promoModel.js";
import jwt from "jsonwebtoken";

/**
 * Validate a promo for a given subtotal + user and compute the discount.
 * Returns { ok, message, discount, promo }. Used by both the /apply route
 * and order placement so the rules live in exactly one place.
 */
export const evaluatePromo = (promo, subtotal, userId) => {
  if (!promo || !promo.active) {
    return { ok: false, message: "Invalid promo code", discount: 0 };
  }
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { ok: false, message: "This promo code has expired", discount: 0 };
  }
  if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
    return {
      ok: false,
      message: `Add items worth ₹${promo.minOrderAmount} to use this code`,
      discount: 0,
    };
  }
  if (userId && promo.usedBy.includes(userId)) {
    return {
      ok: false,
      message: "You have already used this promo code",
      discount: 0,
    };
  }

  let discount = 0;
  if (promo.discountType === "percent") {
    discount = (subtotal * promo.discountValue) / 100;
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }
  } else {
    discount = promo.discountValue;
  }

  // Never discount more than the subtotal; keep it in whole rupees
  discount = Math.min(Math.round(discount), subtotal);

  return { ok: true, message: "Promo code applied", discount, promo };
};

// User applies a code in the cart -> returns the discount it would give
const applyPromo = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.json({ success: false, message: "Enter a promo code" });
    }

    // Optionally identify the user from their token so we can enforce the
    // once-per-account rule already in the cart (guests are checked at checkout).
    let userId = null;
    const { token } = req.headers;
    if (token) {
      try {
        userId = jwt.verify(token, process.env.JWT_SECRET).id;
      } catch {
        userId = null;
      }
    }

    const promo = await promoModel.findOne({ code: code.toUpperCase().trim() });
    const result = evaluatePromo(promo, Number(subtotal) || 0, userId);
    if (!result.ok) {
      return res.json({ success: false, message: result.message });
    }
    res.json({
      success: true,
      message: result.message,
      discount: result.discount,
      code: promo.code,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin: create a new promo code
const createPromo = async (req, res) => {
  try {
    const code = (req.body.code || "").toUpperCase().trim();
    if (!code) {
      return res.json({ success: false, message: "Code is required" });
    }
    const exists = await promoModel.findOne({ code });
    if (exists) {
      return res.json({ success: false, message: "This code already exists" });
    }

    const discountType = req.body.discountType === "flat" ? "flat" : "percent";
    const discountValue = Number(req.body.discountValue);
    if (!discountValue || discountValue <= 0) {
      return res.json({ success: false, message: "Enter a valid discount value" });
    }
    if (discountType === "percent" && discountValue > 100) {
      return res.json({ success: false, message: "Percentage cannot exceed 100" });
    }

    const promo = new promoModel({
      code,
      discountType,
      discountValue,
      maxDiscount: Number(req.body.maxDiscount) || 0,
      minOrderAmount: Number(req.body.minOrderAmount) || 0,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
    });
    await promo.save();
    res.json({ success: true, message: "Promo code created" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin: list all promo codes
const listPromos = async (req, res) => {
  try {
    const promos = await promoModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: promos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin: delete a promo code
const removePromo = async (req, res) => {
  try {
    await promoModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Promo code removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Admin: turn a promo on/off without deleting it
const togglePromo = async (req, res) => {
  try {
    const promo = await promoModel.findById(req.body.id);
    if (!promo) {
      return res.json({ success: false, message: "Promo not found" });
    }
    promo.active = !promo.active;
    await promo.save();
    res.json({ success: true, message: "Promo updated", active: promo.active });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { applyPromo, createPromo, listPromos, removePromo, togglePromo };
