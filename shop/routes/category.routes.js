const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');


router.get('/', async (req, res) => {
  await CategoryController.getAll(req, res);
});

router.get('/:id', async (req, res) => {
  await CategoryController.getById(req, res);
});

router.get('/:parentId/subcategories', async (req, res) => {
  await CategoryController.getSubcategories(req, res);
});

router.post('/', async (req, res) => {
  await CategoryController.create(req, res);
});

router.put('/:id', async (req, res) => {
  await CategoryController.update(req, res);
});

router.delete('/:id', async (req, res) => {
  await CategoryController.delete(req, res);
});

module.exports = router;