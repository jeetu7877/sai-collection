const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    size: String,
    color: String,
    sku: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: String,
    gstRate: { type: Number, default: 5 },
    gstAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["Cash", "UPI", "Card", "QR"], default: "Cash" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Refunded", "Failed"], default: "Pending" },

    orderStatus: {
      type: String,
      enum: ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Placed",
    },

    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    pointsEarned: { type: Number, default: 0 },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff who billed it (in-store)
    channel: { type: String, enum: ["Online", "In-Store"], default: "Online" },

    invoiceUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
