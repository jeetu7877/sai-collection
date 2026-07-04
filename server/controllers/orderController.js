const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");
const StockHistory = require("../models/StockHistory");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { generateOrderNumber } = require("../utils/skuGenerator");
const generateInvoice = require("../utils/invoiceGenerator");

// @desc Place an order (from cart or direct buy-now), applies coupon + GST + loyalty points
// @route POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, couponCode, shippingAddress, paymentMethod, channel = "Online" } = req.body;
    // items: [{ productId, size, color, quantity }]

    if (!items || items.length === 0) return res.status(400).json({ message: "No items in order" });

    let subtotal = 0;
    const orderItems = [];

    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(404).json({ message: `Product ${it.productId} not found` });

      const variant = product.variants.find((v) => v.size === it.size && v.color === it.color);
      if (!variant || variant.stock < it.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} (${it.size}/${it.color})` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        size: it.size,
        color: it.color,
        sku: variant.sku,
        price: product.price,
        quantity: it.quantity,
      });
      subtotal += product.price * it.quantity;

      // Deduct stock
      variant.stock -= it.quantity;
      product.purchaseCount += it.quantity;
      await product.save();

      await StockHistory.create({
        product: product._id,
        sku: variant.sku,
        change: -it.quantity,
        reason: "Sale",
        balanceAfter: variant.stock,
        performedBy: req.user._id,
      });

      if (variant.stock <= product.lowStockThreshold) {
        await Notification.create({
          type: "LowStock",
          message: `Low stock: ${product.name} (${variant.sku}) has only ${variant.stock} left`,
        });
      }
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (!coupon.expiresAt || coupon.expiresAt > Date.now()) {
          discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const gstRate = 5;
    const taxableAmount = subtotal - discount;
    const gstAmount = Number(((taxableAmount * gstRate) / 100).toFixed(2));
    const total = Number((taxableAmount + gstAmount).toFixed(2));

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items: orderItems,
      subtotal,
      discount,
      couponCode,
      gstRate,
      gstAmount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Paid",
      shippingAddress,
      channel,
      soldBy: channel === "In-Store" ? req.user._id : undefined,
    });

    // Loyalty points
    const points = req.user.addLoyaltyPoints(total);
    order.pointsEarned = points;
    await order.save();
    await req.user.save();

    // Clear cart if it was an online cart checkout
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Generate invoice PDF
    try {
      const invoiceUrl = await generateInvoice(order, req.user);
      order.invoiceUrl = invoiceUrl;
      await order.save();
    } catch (e) {
      console.error("Invoice generation failed:", e.message);
    }

    await Notification.create({
      type: "NewOrder",
      message: `New order ${order.orderNumber} placed by ${req.user.name}`,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @desc Get logged-in customer's orders
// @route GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc Get single order
// @route GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc List all orders (admin/staff) with filters
// @route GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, channel, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (channel) query.channel = channel;

    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(query);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc Update order status (Confirmed/Packed/Shipped/Delivered/Cancelled)
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    if (orderStatus) {
      await Notification.create({
        user: order.customer,
        type: "DeliveryUpdate",
        message: `Your order ${order.orderNumber} is now ${orderStatus}`,
      });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
