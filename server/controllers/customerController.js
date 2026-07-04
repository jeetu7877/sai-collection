const User = require("../models/User");
const Order = require("../models/Order");

// @desc List customers (admin/staff) with purchase summary
// @route GET /api/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: "customer" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    const customers = await User.find(query)
      .select("-password")
      .sort("-totalSpending")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @desc Get single customer profile with order history
// @route GET /api/customers/:id
exports.getCustomerProfile = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select("-password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const orders = await Order.find({ customer: customer._id }).sort("-createdAt");
    res.json({ customer, orders });
  } catch (err) { next(err); }
};

// @desc Upcoming birthdays (for marketing module)
// @route GET /api/customers/reports/birthdays
exports.getUpcomingBirthdays = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer", birthday: { $exists: true, $ne: null } });
    const today = new Date();
    const upcoming = customers.filter((c) => {
      const b = new Date(c.birthday);
      const thisYearBday = new Date(today.getFullYear(), b.getMonth(), b.getDate());
      const diffDays = (thisYearBday - today) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 30;
    });
    res.json(upcoming);
  } catch (err) { next(err); }
};
