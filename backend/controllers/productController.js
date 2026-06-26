import productModel from "../models/productModel.js";
import fs from "fs/promises";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, size, category, stock } = req.body;
    const image_filename = req.file ? req.file.filename : undefined;

    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      size,
      image: image_filename,
      stock: Number(stock) || 0,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.image) {
      await fs.unlink(`uploads/${product.image}`).catch(() => {});
    }
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkRemoveProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No IDs provided" });
    }
    const products = await productModel.find({ _id: { $in: ids } });
    await Promise.all(
      products.map(async (p) => {
        if (p.image) await fs.unlink(`uploads/${p.image}`).catch(() => {});
      })
    );
    await productModel.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} products removed` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, bulkRemoveProducts };
