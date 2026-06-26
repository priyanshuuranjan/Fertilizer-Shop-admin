import { body, validationResult } from "express-validator";

// Runs after a set of validation chains. If any failed, it short-circuits with
// a 400 and the first error message; otherwise it hands off to the controller.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({
    success: false,
    message: errors.array()[0].msg,
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};

export const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginRules = [
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const productRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("size").trim().notEmpty().withMessage("Size is required"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number"),
];

export const placeOrderRules = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("address").notEmpty().withMessage("Delivery address is required"),
  body("address.firstName").trim().notEmpty().withMessage("First name is required"),
  body("address.phone").trim().notEmpty().withMessage("Phone number is required"),
];
