const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplier.controller');

router.get('/', async (req, res) => {
  await SupplierController.getAll(req, res);
});

router.get('/:id', async (req, res) => {
  await SupplierController.getById(req, res);
});

router.post('/', async (req, res) => {
  await SupplierController.create(req, res);
});

router.put('/:id', async (req, res) => {
  await SupplierController.update(req, res);
});

router.delete('/:id', async (req, res) => {
  await SupplierController.delete(req, res);
});

module.exports = router;