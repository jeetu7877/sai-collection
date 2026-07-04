const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["Rent", "Salary", "Utilities", "Marketing", "Maintenance", "Other"], default: "Other" },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
