require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// ---------- Socket.io (live order/stock updates) ----------
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] },
});
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => console.log("🔌 Client disconnected:", socket.id));
});
app.set("io", io); // accessible in controllers via req.app.get("io")

// ---------- Security & core middleware ----------
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", limiter);

// Static file serving for uploaded product images & invoices
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api", require("./routes/cartWishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/catalog", require("./routes/catalogRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 MenStyle Pro API running on http://localhost:${PORT}`);
  });
});

module.exports = { app, io };
