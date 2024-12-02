const Category = require("../models/mysql/Category");

class CategoryController {
  static async getAll(req, res) {
    try {
      const totalCategories = await Category.getAll();
      const categories = buildCategoryTree(totalCategories);
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.getById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  
  static async getSubcategories(req, res) {
    try {
      const { parentId } = req.params;
      const subcategories = await Category.getSubcategories(parentId);

      res.json({
        success: true,
        data: subcategories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const categoryId = await Category.create(req.body);
      res.status(201).json({
        success: true,
        data: { id: categoryId },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const success = await Category.update(id, req.body);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.json({
        success: true,
        message: "Category updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await Category.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

const buildCategoryTree = (categories) => {
  const categoryMap = new Map();

  // Tạo map từ id đến category
  categories.forEach((category) => {
    category.children = [];
    categoryMap.set(category.id, category);
  });

  // Xây dựng cây
  const tree = [];
  categories.forEach((category) => {
    if (category.parent_id === null) {
      tree.push(category);
    } else {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(category);
      }
    }
  });

  return tree;
};

module.exports = CategoryController;