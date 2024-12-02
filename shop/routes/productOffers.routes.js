const express = require('express');
const router = express.Router();
const ProductOffersController = require('../controllers/productOffers.controller');

router.get('/', async (req, res) => {
  await ProductOffersController.getAll(req, res);
});

router.get('/:id', async (req, res) => {
  await ProductOffersController.getById(req, res);
});

router.post('/', async (req, res) => {
  await ProductOffersController.create(req, res);
});

router.put('/:id', async (req, res) => {
  await ProductOffersController.update(req, res);
});

router.delete('/:id', async (req, res) => {
  await ProductOffersController.delete(req, res);
});

router.get('/supplier/:supplierId', async (req, res) => {
  await ProductOffersController.getBySupplier(req, res);
});

module.exports = router;