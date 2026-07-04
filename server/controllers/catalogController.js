const Category = require("../models/Category");
const Brand = require("../models/Brand");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await Category.create({ name, slug, image });
    res.status(201).json(category);
  } catch (err) { next(err); }
};

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.json(brands);
  } catch (err) { next(err); }
};

exports.createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (err) { next(err); }
};
