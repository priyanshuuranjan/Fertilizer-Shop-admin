import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import promoModel from "../models/promoModel.js";
import { evaluatePromo } from "./promoController.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DELIVERY_FEE = 45;

// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;

  try {
    // Verify stock availability server-side before anything else, so we never
    // create a Stripe session for items we can't actually fulfil.
    const stockIssues = [];
    for (const item of req.body.items) {
      const product = await productModel.findById(item._id).select("name stock");
      if (!product) {
        stockIssues.push(`${item.name} is no longer available`);
      } else if (product.stock < item.quantity) {
        stockIssues.push(
          `${product.name} — only ${product.stock} left (you asked for ${item.quantity})`
        );
      }
    }
    if (stockIssues.length > 0) {
      return res.json({
        success: false,
        message: stockIssues.join(". "),
        outOfStock: true,
      });
    }

    // Recompute the subtotal from the items server-side (don't trust client amount)
    const subtotal = req.body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Re-validate the promo server-side; ignore it silently if it no longer applies
    let discount = 0;
    let appliedCode = "";
    if (req.body.promoCode) {
      const promo = await promoModel.findOne({
        code: String(req.body.promoCode).toUpperCase().trim(),
      });
      const result = evaluatePromo(promo, subtotal, req.body.userId);
      if (result.ok) {
        discount = result.discount;
        appliedCode = promo.code;
      }
    }

    const amount = subtotal + DELIVERY_FEE - discount;

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount,
      address: req.body.address,
      promoCode: appliedCode,
      discount,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", {
        orderId: newOrder._id,
        amount,
        customerName: req.body.address?.firstName || "Customer",
      });
    }

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    // Apply the discount in Stripe via a one-time coupon
    let discounts = [];
    if (discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discount * 100,
        currency: "inr",
        duration: "once",
        name: `Promo ${appliedCode}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      discounts,
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      const order = await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
      });
      // Decrement stock only after a confirmed payment, so abandoned checkouts
      // never reserve inventory. Atomic $inc avoids lost-update races.
      if (order && Array.isArray(order.items)) {
        await Promise.all(
          order.items.map((item) =>
            productModel.updateOne(
              { _id: item._id },
              { $inc: { stock: -Math.abs(item.quantity || 0) } }
            )
          )
        );
      }
      // Burn the promo for this user only after a confirmed payment, so a
      // cancelled checkout never costs them their one-time code.
      if (order && order.promoCode) {
        await promoModel.updateOne(
          { code: order.promoCode },
          { $addToSet: { usedBy: order.userId } }
        );
      }
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing order for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// making  api for updating order status on frontend
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const exportOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    const header =
      "Order ID,Customer Name,Phone,Items,Amount,Status,Payment,Date\n";
    const rows = orders
      .map((o) => {
        const items = o.items
          .map((i) => `${i.name} x${i.quantity}`)
          .join(" | ");
        const name = `${o.address.firstName || ""} ${o.address.lastName || ""}`.trim();
        const date = new Date(o.date).toLocaleDateString("en-IN");
        const phone = o.address.phone || "";
        return `${o._id},"${name}","${phone}","${items}",${o.amount},${o.status},${o.payment ? "Yes" : "No"},${date}`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="orders-export.csv"'
    );
    res.send(header + rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, exportOrders };
