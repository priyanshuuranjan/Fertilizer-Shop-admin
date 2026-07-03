// One-time utility: give every product that currently has 0 (or missing) stock
// a starting quantity. Useful right after adding the `stock` field, since older
// products default to 0 and show as "Out of Stock".
//
// Usage:  node scripts/restoreStock.js [quantity]
//         node scripts/restoreStock.js 50     (default is 50)

import "dotenv/config";
import mongoose from "mongoose";
import productModel from "../models/productModel.js";

const qty = Number(process.argv[2]) || 50;

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");

  const result = await productModel.updateMany(
    { $or: [{ stock: { $lte: 0 } }, { stock: { $exists: false } }] },
    { $set: { stock: qty } }
  );

  console.log(
    `Updated ${result.modifiedCount} product(s) to stock = ${qty}`
  );

  await mongoose.disconnect();
  console.log("Done.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
