const express = require("express");
const router = express.Router();
const WarehouseExportController = require("../controllers/warehouseExport.controller");

router.post("/", async (req, res) => {
  await WarehouseExportController.createExport(req, res);
});

router.put("/:id/status", async (req, res) => {
  await WarehouseExportController.updateStatus(req, res);
});

router.put("/:id/cancel", async (req, res) => {
  await WarehouseExportController.cancelExport(req, res);
});

router.get("/", async (req, res) => {
  await WarehouseExportController.getAll(req, res);
});

router.get("/:id", async (req, res) => {
  await WarehouseExportController.getById(req, res);
});

module.exports = router;