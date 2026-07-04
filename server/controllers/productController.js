const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");
const { generateSKU } = require("../utils/skuGenerator");

// @desc List products with filters, search, sorting, pagination (for Shop page)
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      type,
      brand,
      category,
      color,
      size,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (type) query.type = { $in: type.split(",") };
    if (brand) query.brand = { $in: brand.split(",") };
    if (category) query.category = { $in: category.split(",") };
    if (color) query["variants.color"] = { $in: color.split(",") };
    if (size) query["variants.size"] = { $in: size.split(",") };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      "price-asc": "price",
      "price-desc": "-price",
      newest: "-createdAt",
      popular: "-purchaseCount",
      rating: "-ratingAvg",
    };

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("brand", "name")
      .sort(sortMap[sort] || sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc Get single product by slug + related products
// @route GET /api/products/:slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("brand", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.viewCount += 1;
    await product.save();

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);

    res.json({ product, related });
  } catch (err) {
    next(err);
  }
};

// @desc Featured / new arrivals / best sellers for Home page
// @route GET /api/products/home/sections
exports.getHomeSections = async (req, res, next) => {
  try {
    const [featured, newArrivals, bestSellers] = await Promise.all([
      Product.find({ isFeatured: true, isActive: true }).limit(8),
      Product.find({ isNewArrival: true, isActive: true }).sort("-createdAt").limit(8),
      Product.find({ isBestSeller: true, isActive: true }).limit(8),
    ]);
    res.json({ featured, newArrivals, bestSellers });
  } catch (err) {
    next(err);
  }
};

// @desc Create product (admin/staff)
// @route POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);

    if (body.variants && Array.isArray(body.variants)) {
      body.variants = body.variants.map((v) => ({
        ...v,
        sku: v.sku || generateSKU(body.type, v.color, v.size),
      }));
    }

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc Update product
// @route PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc Delete (soft-delete) product
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deactivated" });
  } catch (err) {
    next(err);
  }
};

// @desc Bulk import products (JSON array)
// @route POST /api/products/bulk-import
exports.bulkImport = async (req, res, next) => {
  try {
    const items = req.body.products;
    if (!Array.isArray(items)) return res.status(400).json({ message: "products must be an array" });

    const prepared = items.map((p) => ({
      ...p,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6),
    }));

    const created = await Product.insertMany(prepared, { ordered: false });
    res.status(201).json({ inserted: created.length });
  } catch (err) {
    next(err);
  }
};

// @desc Bulk export products (JSON)
// @route GET /api/products/bulk-export
exports.bulkExport = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category", "name").populate("brand", "name");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @desc Low stock report
// @route GET /api/products/reports/low-stock
exports.lowStockReport = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    const lowStock = products
      .map((p) => ({
        _id: p._id,
        name: p.name,
        variants: p.variants.filter((v) => v.stock <= p.lowStockThreshold),
      }))
      .filter((p) => p.variants.length > 0);
    res.json(lowStock);
  } catch (err) {
    next(err);
  }
};

// @desc Adjust stock manually (restock / correction) and log history
// @route POST /api/products/:id/adjust-stock
exports.adjustStock = async (req, res, next) => {
  try {
    const { sku, change, reason = "Adjustment" } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.find((v) => v.sku === sku);
    if (!variant) return res.status(404).json({ message: "Variant SKU not found" });

    variant.stock += Number(change);
    await product.save();

    await StockHistory.create({
      product: product._id,
      sku,
      change,
      reason,
      balanceAfter: variant.stock,
      performedBy: req.user?._id,
    });

    res.json({ message: "Stock updated", variant });
  } catch (err) {
    next(err);
  }
};
