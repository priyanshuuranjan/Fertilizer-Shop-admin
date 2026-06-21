import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Single-admin login: credentials live in .env (never in the client bundle).
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Sign a short-lived token so a stolen token can't live forever.
      const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.json({ success: true, token });
    }
    res.json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { adminLogin };
