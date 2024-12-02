const Category = require('../models/mysql/Category');

const validateProductData = async (req, res, next) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const category = await Category.getById(productData.categoryId);
    if (!category) {
      throw new Error('Invalid category');
    }
    // Thêm validation logic
    req.productData = productData; // Lưu data đã validate để dùng ở controller
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateProductData
};