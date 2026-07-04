const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// ---------- CART ----------

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size && i.color === color
    );
    if (existing) existing.quantity += quantity;
    else cart.items.push({ product: productId, size, color, quantity });

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, size, color, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size && i.color === color
    );
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i !== item);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.size === size && i.color === color)
    );
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// ---------- WISHLIST ----------

exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const exists = wishlist.products.some((p) => p.toString() === productId);
    if (exists) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    } else {
      wishlist.products.push(productId);
    }
    await wishlist.save();
    await wishlist.populate("products");
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};
