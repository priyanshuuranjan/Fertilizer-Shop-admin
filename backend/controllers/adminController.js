import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import staffModel from "../models/staffModel.js";

dotenv.config();

// Super Admin credentials live in .env (never in the client bundle). Staff
// accounts live in Mongo, created by the Super Admin from the admin panel.
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "superadmin", email, name: "Super Admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.json({ success: true, token, role: "superadmin", name: "Super Admin" });
    }

    const staff = await staffModel.findOne({ email });
    if (staff) {
      const isMatch = await bcrypt.compare(password, staff.password);
      if (isMatch) {
        const token = jwt.sign(
          { role: "staff", email: staff.email, id: staff._id, name: staff.name },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        return res.json({ success: true, token, role: "staff", name: staff.name });
      }
    }

    res.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ---- Staff management (Super Admin only, enforced at the route level) ----

const addStaff = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await staffModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "A staff account with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const staff = await staffModel.create({ name, email, password: hashedPassword });
    res.json({
      success: true,
      message: "Staff account created",
      data: { _id: staff._id, name: staff.name, email: staff.email, createdAt: staff.createdAt },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating staff account" });
  }
};

const listStaff = async (req, res) => {
  try {
    const staff = await staffModel.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error loading staff accounts" });
  }
};

const removeStaff = async (req, res) => {
  try {
    await staffModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Staff account removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing staff account" });
  }
};

export { adminLogin, addStaff, listStaff, removeStaff };
