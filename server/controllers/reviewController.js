const Review = require("../models/Review");
const Product = require("../models/Product");

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name").sort("-createdAt");
    res.json(reviews);
  } catch (err) { next(err); }
};

exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { product: productId, user: req.user._id },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    if (stats[0]) {
      await Product.findByIdAndUpdate(productId, {
        ratingAvg: Number(stats[0].avg.toFixed(1)),
        ratingCount: stats[0].count,
      });
    }

    res.status(201).json(review);
  } catch (err) { next(err); }
};
