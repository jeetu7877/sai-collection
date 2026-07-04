const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // S, M, L, XL, XXL or numeric waist size
    color: { type: String, required: true },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

    type: {
      type: String,
      enum: ["Shirt", "Jeans", "T-Shirt", "Trouser", "Jacket", "Blazer"],
      required: true,
    },

    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },

    images: [{ type: String }],

    material: String,
    fitType: { type: String, enum: ["Slim", "Regular", "Relaxed", "Oversized"], default: "Regular" },
    sleeve: { type: String, enum: ["Full", "Half", "Sleeveless", "N/A"], default: "N/A" },
    occasion: [String], // Casual, Formal, Party, Wedding
    washInstructions: String,

    variants: [variantSchema],

    tags: [String],
    barcode: String,

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    viewCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

productSchema.virtual("totalStock").get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
