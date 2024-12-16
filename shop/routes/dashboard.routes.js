const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboard.controller");

// Route tổng quan
router.get("/overview", DashboardController.getOverview);

// Route thống kê bán hàng
router.get("/sales", DashboardController.getSalesStats);

// Route sản phẩm bán chạy
router.get("/top-products", DashboardController.getTopProducts);

// Route tình trạng kho
router.get("/stock-status", DashboardController.getStockStatus);

module.exports = router;