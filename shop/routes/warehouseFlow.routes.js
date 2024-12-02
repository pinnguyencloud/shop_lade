const express = require('express');
const router = express.Router();
const WarehouseFlowController = require('../controllers/warehouseFlow.controller');

router.get('/product/:code', async (req, res) => {
  await WarehouseFlowController.findProduct(req, res);
});

router.post('/preview', async (req, res) => {
  await WarehouseFlowController.previewExport(req, res);
});

router.post('/', async (req, res) => {
  await WarehouseFlowController.createExport(req, res);
});

router.get('/', async (req, res) => {
  await WarehouseFlowController.getAllExports(req, res);
});

router.get('/:id', async (req, res) => {
  await WarehouseFlowController.getExportDetail(req, res);
});

router.post('/:id/print', async (req, res) => {
  await WarehouseFlowController.printExport(req, res);
});

module.exports = router;