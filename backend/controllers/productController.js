import productModel from "../models/productModel.js";
import fs from "fs/promises";
import { cacheGet, cacheSet, cacheDel } from "../config/cache.js";

const PRODUCT_LIST_KEY = "products:list";

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
    await cacheDel(PRODUCT_LIST_KEY); // stale list now, drop it
    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    // Serve from cache when warm; otherwise hit the DB and backfill the cache.
    const cached = await cacheGet(PRODUCT_LIST_KEY);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }
    const products = await productModel.find({});
    await cacheSet(PRODUCT_LIST_KEY, products, 60); // 60s TTL
    res.json({ success: true, data: products });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Paginated, searchable, filterable product listing.
// Query params: page, limit, q (search), category, sort, minPrice, maxPrice
const searchProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.q) {
      // Case-insensitive partial match on name (regex beats $text for substrings)
      filter.name = { $regex: String(req.query.q).trim(), $options: "i" };
    }
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      newest: { _id: -1 },
    };
    const sort = sortMap[req.query.sort] || { _id: -1 };

    const [products, total] = await Promise.all([
      productModel.find(filter).sort(sort).skip(skip).limit(limit),
      productModel.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    await cacheDel(PRODUCT_LIST_KEY);
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
    await cacheDel(PRODUCT_LIST_KEY);
    res.json({ success: true, message: `${ids.length} products removed` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProduct,
  searchProducts,
  removeProduct,
  bulkRemoveProducts,
};
