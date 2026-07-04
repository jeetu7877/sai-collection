const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: String,
    color: String,
    quantity: { type: Number, required: true },
    costPrice: { type: Number, required: true },
  },
  { _id: false }
);

const purchaseEntrySchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [purchaseItemSchema],
    totalCost: { type: Number, required: true },
    invoiceNumber: String,
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseEntry", purchaseEntrySchema);
