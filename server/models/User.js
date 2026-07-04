const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "staff", "customer"], default: "customer" },

    // Loyalty
    rewardPoints: { type: Number, default: 0 },
    membershipTier: { type: String, enum: ["Standard", "Silver", "Gold", "VIP"], default: "Standard" },
    totalSpending: { type: Number, default: 0 },
    visitCount: { type: Number, default: 0 },

    // Personal
    birthday: Date,
    anniversary: Date,
    favoriteSizes: [String],
    favoriteColors: [String],

    addresses: [addressSchema],

    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },

    isVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.addLoyaltyPoints = function (amountSpent) {
  const points = Math.floor(amountSpent / 100) * 10; // ₹100 = 10 points
  this.rewardPoints += points;
  this.totalSpending += amountSpent;
  if (this.totalSpending >= 100000) this.membershipTier = "VIP";
  else if (this.totalSpending >= 50000) this.membershipTier = "Gold";
  else if (this.totalSpending >= 20000) this.membershipTier = "Silver";
  return points;
};

module.exports = mongoose.model("User", userSchema);
