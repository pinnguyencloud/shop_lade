const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/warehouse.controller');

router.get('/imports', async (req, res) => {
  await WarehouseController.getAllImports(req, res);
});

router.get('/imports/:id', async (req, res) => {
  await WarehouseController.getImportById(req, res);
});

router.post('/imports', async (req, res) => {
  await WarehouseController.createImport(req, res);
});

router.put('/imports/:id/status', async (req, res) => {
  await WarehouseController.updateStatus(req, res);
});

router.get('/inventory', async (req, res) => {
  await WarehouseController.getAllInventory(req, res);
});

router.get('/inventory/:productId', async (req, res) => {
  await WarehouseController.checkInventory(req, res);
});

module.exports = router;