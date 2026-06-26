import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

const listCustomers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password -cartData")
      .lean();

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await orderModel
          .find({ userId: user._id.toString(), payment: true })
          .select("amount");
        const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          orderCount: orders.length,
          totalSpent,
        };
      })
    );

    res.json({ success: true, data: usersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listCustomers };
