require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { generateSKU } = require("../utils/skuGenerator");

const run = async () => {
  await connectDB();
  console.log("🌱 Seeding database...");

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  // ---------- Users ----------
  await User.create([
    { name: "Admin User", email: "admin@menstylepro.com", password: "admin123", role: "admin", isVerified: true },
    { name: "Staff Member", email: "staff@menstylepro.com", password: "staff123", role: "staff", isVerified: true },
    { name: "Rahul Sharma", email: "rahul@example.com", password: "customer123", role: "customer", rewardPoints: 340, membershipTier: "Silver", totalSpending: 22000, isVerified: true },
  ]);

  // ---------- Categories ----------
  const categoryNames = ["Shirts", "Jeans", "T-Shirts", "Trousers", "Jackets", "Blazers"];
  const categories = await Category.insertMany(
    categoryNames.map((name) => ({ name, slug: name.toLowerCase() }))
  );
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  // ---------- Brands ----------
  const brandNames = ["MenStyle Originals", "Urban Threads", "Classic Fit Co.", "Denim Republic"];
  const brands = await Brand.insertMany(brandNames.map((name) => ({ name })));
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b._id]));

  // ---------- Products ----------
  const colors = ["White", "Black", "Navy", "Grey", "Maroon", "Olive"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const makeVariants = (type) =>
    colors.slice(0, 3).flatMap((color) =>
      sizes.slice(1, 4).map((size) => ({
        size,
        color,
        stock: Math.floor(Math.random() * 30) + 2,
        sku: generateSKU(type, color, size),
      }))
    );

  const productsData = [
    {
      name: "Classic Oxford Formal Shirt",
      type: "Shirt",
      category: catMap["Shirts"],
      brand: brandMap["Classic Fit Co."],
      price: 1299,
      mrp: 1799,
      discountPercent: 28,
      material: "100% Cotton",
      fitType: "Slim",
      sleeve: "Full",
      occasion: ["Formal", "Office"],
      washInstructions: "Machine wash cold, do not bleach",
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"],
      isFeatured: true,
      isBestSeller: true,
      tags: ["formal", "office", "cotton"],
    },
    {
      name: "Slim Fit Stretch Denim Jeans",
      type: "Jeans",
      category: catMap["Jeans"],
      brand: brandMap["Denim Republic"],
      price: 1899,
      mrp: 2499,
      discountPercent: 24,
      material: "Denim, 2% Elastane",
      fitType: "Slim",
      sleeve: "N/A",
      occasion: ["Casual"],
      washInstructions: "Machine wash cold, inside out",
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"],
      isFeatured: true,
      isNewArrival: true,
      tags: ["denim", "casual", "stretch"],
    },
    {
      name: "Premium Crew Neck T-Shirt",
      type: "T-Shirt",
      category: catMap["T-Shirts"],
      brand: brandMap["Urban Threads"],
      price: 599,
      mrp: 899,
      discountPercent: 33,
      material: "100% Combed Cotton",
      fitType: "Regular",
      sleeve: "Half",
      occasion: ["Casual"],
      washInstructions: "Machine wash cold",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
      isBestSeller: true,
      isNewArrival: true,
      tags: ["tshirt", "casual", "everyday"],
    },
    {
      name: "Tailored Formal Trousers",
      type: "Trouser",
      category: catMap["Trousers"],
      brand: brandMap["Classic Fit Co."],
      price: 1499,
      mrp: 1999,
      discountPercent: 25,
      material: "Poly-Viscose Blend",
      fitType: "Regular",
      sleeve: "N/A",
      occasion: ["Formal", "Office"],
      washInstructions: "Dry clean recommended",
      images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800"],
      tags: ["formal", "trouser", "office"],
    },
    {
      name: "Bomber Jacket",
      type: "Jacket",
      category: catMap["Jackets"],
      brand: brandMap["Urban Threads"],
      price: 2799,
      mrp: 3799,
      discountPercent: 26,
      material: "Polyester Shell",
      fitType: "Regular",
      sleeve: "Full",
      occasion: ["Casual", "Party"],
      washInstructions: "Dry clean only",
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"],
      isFeatured: true,
      isNewArrival: true,
      tags: ["jacket", "winter", "casual"],
    },
    {
      name: "Notch Lapel Blazer",
      type: "Blazer",
      category: catMap["Blazers"],
      brand: brandMap["MenStyle Originals"],
      price: 4499,
      mrp: 5999,
      discountPercent: 25,
      material: "Wool Blend",
      fitType: "Slim",
      sleeve: "Full",
      occasion: ["Formal", "Wedding", "Party"],
      washInstructions: "Dry clean only",
      images: ["https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=800"],
      isFeatured: true,
      isBestSeller: true,
      tags: ["blazer", "wedding", "formal"],
    },
    {
      name: "Casual Linen Shirt",
      type: "Shirt",
      category: catMap["Shirts"],
      brand: brandMap["MenStyle Originals"],
      price: 1099,
      mrp: 1499,
      discountPercent: 27,
      material: "Pure Linen",
      fitType: "Relaxed",
      sleeve: "Full",
      occasion: ["Casual", "Party"],
      washInstructions: "Machine wash cold, hang dry",
      images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"],
      isNewArrival: true,
      tags: ["linen", "summer", "casual"],
    },
    {
      name: "Relaxed Fit Cargo Trousers",
      type: "Trouser",
      category: catMap["Trousers"],
      brand: brandMap["Urban Threads"],
      price: 1699,
      mrp: 2199,
      discountPercent: 23,
      material: "Cotton Twill",
      fitType: "Relaxed",
      sleeve: "N/A",
      occasion: ["Casual"],
      washInstructions: "Machine wash cold",
      images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"],
      isNewArrival: true,
      tags: ["cargo", "casual", "streetwear"],
    },
  ];

  await Product.insertMany(
    productsData.map((p) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6),
      description: `${p.name} crafted from ${p.material}. Designed for ${p.occasion.join(
        " & "
      )} occasions with a ${p.fitType.toLowerCase()} fit.`,
      variants: makeVariants(p.type),
    }))
  );

  // ---------- Coupons ----------
  await Coupon.create([
    { code: "WELCOME10", type: "percent", value: 10, minOrderValue: 999, maxDiscount: 500, reason: "General" },
    { code: "FEST25", type: "percent", value: 25, minOrderValue: 2000, maxDiscount: 1000, reason: "Festival" },
    { code: "FLAT200", type: "flat", value: 200, minOrderValue: 1500, reason: "General" },
  ]);

  console.log("✅ Seed complete!");
  console.log("   Admin login:  admin@menstylepro.com / admin123");
  console.log("   Staff login:  staff@menstylepro.com / staff123");
  console.log("   Customer login: rahul@example.com / customer123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
