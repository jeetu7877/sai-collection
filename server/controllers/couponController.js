const Coupon = require("../models/Coupon");

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort("-createdAt");
    res.json(coupons);
  } catch (err) { next(err); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) { next(err); }
};

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ valid: false, message: "Coupon not found" });
    if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
      return res.status(400).json({ valid: false, message: "Coupon expired" });
    }
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({ valid: false, message: `Minimum order value is ₹${coupon.minOrderValue}` });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, message: "Coupon usage limit reached" });
    }
    let discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    res.json({ valid: true, discount, coupon });
  } catch (err) { next(err); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) { next(err); }
};
