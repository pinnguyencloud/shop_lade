const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Database connections
const connectMongoDB = require("./config/mongodb.config");

// Middlewares
const { errorHandler } = require("./middlewares/error.middleware");
const { cacheMiddleware } = require("./middlewares/cache.middleware");

// Routes
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const supplierRoutes = require("./routes/supplier.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const productOffersRoutes = require("./routes/productOffers.routes");
const warehouseFlowRoutes = require("./routes/warehouseFlow.routes");

const app = express();

// Connect to MongoDB

connectMongoDB();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "public", "uploads", "products"))
);
// API trả về URL ảnh cho sản phẩm
app.get("/api/product-image", (req, res) => {
  // Giả sử bạn truyền ID ảnh qua query params (ví dụ: 1732607098122)
  const imageId = req.query.id;
  // Tạo đường dẫn tới ảnh trong thư mục 'uploads/products'
  const imageUrl = `/uploads/products/${imageId}-image.jpg`;

  // Trả về đường dẫn URL ảnh
  res.json({ imageUrl });
});

// Apply cache to routes (optional)
if (process.env.NODE_ENV === "production") {
  app.use("/api/categories", cacheMiddleware(300)); // Cache for 5 minutes
  app.use("/api/products/category", cacheMiddleware(300));
}

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/offers", productOffersRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/exports", warehouseFlowRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const host = "0.0.0.0";
app.listen(PORT, host, () => {
  console.log(`Server is running on http://${host}:${PORT}`);
});
