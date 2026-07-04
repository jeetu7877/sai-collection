const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null = broadcast to admins/staff
    type: {
      type: String,
      enum: ["NewOrder", "LowStock", "Birthday", "OfferReminder", "InvoiceReady", "DeliveryUpdate"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
