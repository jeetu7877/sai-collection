const Product = require("../models/Product");

// @desc AI-style outfit recommendation based on age/height/weight/budget/occasion
// @route POST /api/ai/outfit-recommendation
exports.recommendOutfit = async (req, res, next) => {
  try {
    const { budget = 5000, occasion = "Casual" } = req.body;

    const [shirt, jeans, trouser] = await Promise.all([
      Product.findOne({ type: "Shirt", occasion: occasion, price: { $lte: budget * 0.4 }, isActive: true }).sort("-ratingAvg"),
      Product.findOne({ type: "Jeans", occasion: occasion, price: { $lte: budget * 0.4 }, isActive: true }).sort("-ratingAvg"),
      Product.findOne({ type: "Trouser", occasion: occasion, price: { $lte: budget * 0.4 }, isActive: true }).sort("-ratingAvg"),
    ]);

    const bottom = jeans || trouser;
    const picks = [shirt, bottom].filter(Boolean);
    const totalPrice = picks.reduce((s, p) => s + p.price, 0);

    res.json({
      recommendation: picks,
      totalPrice,
      message: picks.length
        ? `Here's a ${occasion.toLowerCase()} outfit within your ₹${budget} budget`
        : "No matching products found — try a different budget or occasion",
    });
  } catch (err) { next(err); }
};

// @desc AI-style size recommendation from body measurements
// @route POST /api/ai/size-recommendation
exports.recommendSize = async (req, res, next) => {
  try {
    const { height, weight, chest, waist } = req.body; // cm, kg, inches, inches

    let size = "M";
    if (chest) {
      if (chest < 36) size = "S";
      else if (chest < 40) size = "M";
      else if (chest < 44) size = "L";
      else if (chest < 48) size = "XL";
      else size = "XXL";
    } else if (weight) {
      if (weight < 55) size = "S";
      else if (weight < 70) size = "M";
      else if (weight < 85) size = "L";
      else if (weight < 100) size = "XL";
      else size = "XXL";
    }

    res.json({
      recommendedSize: size,
      note: "Estimate based on chest/weight. For best fit, check the product's specific size chart.",
    });
  } catch (err) { next(err); }
};
