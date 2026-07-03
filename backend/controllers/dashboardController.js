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

    // Staff can see order/product/customer counts and fulfil orders, but
    // revenue figures are Super Admin only.
    const isSuperAdmin = req.admin?.role === "superadmin";

    res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders,
        lowStockProducts,
        ...(isSuperAdmin ? { totalRevenue, chartData } : {}),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Deeper analytics powered by MongoDB aggregation:
//   - best-selling products (by units sold)
//   - revenue split by category
//   - monthly revenue trend (last 6 months)
const getSalesAnalytics = async (req, res) => {
  try {
    const [bestSellers, revenueByCategory, monthlyTrendRaw] = await Promise.all([
      orderModel.aggregate([
        { $match: { payment: true } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            unitsSold: { $sum: "$items.quantity" },
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
          },
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: "$_id", unitsSold: 1, revenue: 1 } },
      ]),
      orderModel.aggregate([
        { $match: { payment: true } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.category",
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
          },
        },
        { $sort: { revenue: -1 } },
        { $project: { _id: 0, category: { $ifNull: ["$_id", "Other"] }, revenue: 1 } },
      ]),
      orderModel.aggregate([
        { $match: { payment: true } },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 6 },
      ]),
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyTrend = monthlyTrendRaw.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${String(m._id.year).slice(2)}`,
      revenue: m.revenue,
      orders: m.orders,
    }));

    res.json({
      success: true,
      data: { bestSellers, revenueByCategory, monthlyTrend },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getDashboardStats, getSalesAnalytics };
