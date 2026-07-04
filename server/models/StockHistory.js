const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sku: String,
    change: { type: Number, required: true }, // positive for restock, negative for sale
    reason: { type: String, enum: ["Sale", "Restock", "Return", "Adjustment"], required: true },
    balanceAfter: Number,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockHistory", stockHistorySchema);
