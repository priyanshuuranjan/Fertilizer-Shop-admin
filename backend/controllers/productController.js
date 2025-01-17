import productModel from "../models/productModel.js";
import fs from "fs/promises";
const addProduct = async (req, res) => {
  try {
    const { name, description, price,size, category } = req.body;

    // Handle the file upload
    const image_filename = req.file ? req.file.filename : undefined;

    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      size,
      image: image_filename,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// all product list
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.image) {
      await fs.unlink(`uploads/${product.image}`);
      console.log("Image deleted successfully");
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct };
