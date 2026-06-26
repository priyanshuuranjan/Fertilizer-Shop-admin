import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const getDashboardStats = async (req, res) => {
  try {
    const LOW_STOCK_THRESHOLD = 10;
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      paidOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      orderModel.countDocuments({}),
      productModel.countDocuments({}),
      userModel.countDocuments({}),
      orderModel.find({ payment: true }).select("amount date"),
      orderModel
        .find({})
        .sort({ date: -1 })
        .limit(5)
        .select("amount status date address items"),
      productModel
        .find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
        .sort({ stock: 1 })
        .limit(8)
        .select("name stock category"),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    // Last 7 days chart data
    const now = new Date();
    const dailySales = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
      });
      dailySales[key] = 0;
    }

    paidOrders.forEach((o) => {
      const orderDate = new Date(o.date);
      const diffDays = Math.floor((now - orderDate) / (24 * 60 * 60 * 1000));
      if (diffDays <= 6) {
        const key = orderDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
        });
        if (dailySales[key] !== undefined) dailySales[key] += o.amount;
      }
    });

    const chartData = Object.entries(dailySales).map(([day, revenue]) => ({
      day,
      revenue,
    }));

    res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        chartData,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getDashboardStats };
