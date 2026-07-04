const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Expense = require("../models/Expense");

const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfWeek = (d = new Date()) => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};
const startOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);

// @desc Dashboard summary: sales, profit, top products, low stock, pending orders
// @route GET /api/dashboard/summary
exports.getSummary = async (req, res, next) => {
  try {
    const today = startOfDay(new Date());
    const week = startOfWeek(new Date());
    const month = startOfMonth(new Date());

    const [todaySales, weekSales, monthSales, totalExpenses] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: week }, paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: month }, paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: month } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const monthRevenue = monthSales[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const profit = monthRevenue - expenses;

    const mostSold = await Product.find().sort("-purchaseCount").limit(5).select("name purchaseCount images");

    const lowStockProducts = await Product.find({ isActive: true });
    const lowStock = lowStockProducts.filter((p) => p.variants.some((v) => v.stock <= p.lowStockThreshold)).length;

    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ["Placed", "Confirmed", "Packed"] } });

    const topCustomers = await User.find({ role: "customer" }).sort("-totalSpending").limit(5).select("name totalSpending membershipTier");

    res.json({
      todaySales: { total: todaySales[0]?.total || 0, count: todaySales[0]?.count || 0 },
      weekSales: { total: weekSales[0]?.total || 0, count: weekSales[0]?.count || 0 },
      monthSales: { total: monthRevenue, count: monthSales[0]?.count || 0 },
      profit,
      expenses,
      mostSold,
      lowStockCount: lowStock,
      pendingOrders,
      topCustomers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Revenue graph data (last 30 days)
// @route GET /api/dashboard/revenue-graph
exports.getRevenueGraph = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "Paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// @desc Analytics: peak hours, best category, conversion-ish stats
// @route GET /api/dashboard/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const peakHours = await Order.aggregate([
      { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const bestCategory = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      { $group: { _id: "$productInfo.category", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const avgOrderValue = await Order.aggregate([
      { $group: { _id: null, avg: { $avg: "$total" } } },
    ]);

    const newVsReturning = await User.aggregate([
      { $match: { role: "customer" } },
      {
        $group: {
          _id: null,
          returning: { $sum: { $cond: [{ $gt: ["$visitCount", 1] }, 1, 0] } },
          newCustomers: { $sum: { $cond: [{ $lte: ["$visitCount", 1] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      peakHours,
      bestCategory,
      avgOrderValue: avgOrderValue[0]?.avg || 0,
      newVsReturning: newVsReturning[0] || { returning: 0, newCustomers: 0 },
    });
  } catch (err) {
    next(err);
  }
};
