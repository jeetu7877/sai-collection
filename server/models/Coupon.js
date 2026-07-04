const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "flat"], default: "percent" },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: Number,
    expiresAt: Date,
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    reason: { type: String, enum: ["General", "Birthday", "Festival", "Referral", "FlashSale"], default: "General" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
