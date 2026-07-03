import jwt from "jsonwebtoken";

// Verifies an admin-issued token (Super Admin or Staff) and attaches the
// decoded payload as req.admin. Distinct from the customer authMiddleware,
// which signs { id } tokens for storefront users.
const verifyAdmin = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Please login again." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin" && decoded.role !== "staff") {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Please login again." });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Session expired. Please login again." });
  }
};

// Use after verifyAdmin to restrict a route to the Super Admin only.
const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== "superadmin") {
    return res
      .status(403)
      .json({ success: false, message: "Super Admin access required" });
  }
  next();
};

export { verifyAdmin, requireSuperAdmin };
