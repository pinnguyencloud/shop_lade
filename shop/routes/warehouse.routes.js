const express = require("express");
const router = express.Router();
const WarehouseController = require("../controllers/warehouse.controller");

router.get("/imports", async (req, res) => {
  await WarehouseController.getAllImports(req, res);
});

router.get("/imports/history", async (req, res) => {
  await WarehouseController.getWarehouseHistory(req, res);
});

router.get("/imports/:id", async (req, res) => {
  await WarehouseController.getImportById(req, res);
});

router.post("/imports", async (req, res) => {
  await WarehouseController.createImport(req, res);
});

router.put("/imports/:id/complete", async (req, res) => {
  await WarehouseController.updateImportStatus(req, res);
});
router.get('/inventory/low-stock', async (req, res) => {
  await WarehouseController.checkLowStockAndNotify(req, res);
});
module.exports = router;
