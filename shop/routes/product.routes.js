const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");

router.get("/filter", async (req, res) => {
  await ProductController.filter(req, res);
});


router.get("/category/:categoryId", async (req, res) => {
  await ProductController.getByCategory(req, res);
});



router.get("/:id", async (req, res) => {
  await ProductController.getById(req, res);
});


router.post("/", async (req, res) => {
  await ProductController.create(req, res);
});

router.put("/:id", async (req, res) => {
  await ProductController.update(req, res);
});

router.delete("/:id", async (req, res) => {
  await ProductController.delete(req, res);
});

module.exports = router;
