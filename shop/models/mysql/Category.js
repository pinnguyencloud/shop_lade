const pool = require('../../config/mysql.config');
const Product = require('../mongodb/Product');

class Category {
  static async getAllChildIds(parentId) {
    const [rows] = await pool.query(`
      WITH RECURSIVE category_tree AS (
        SELECT id FROM categories 
        WHERE parent_id = ? AND is_active = true
        
        UNION ALL
        
        SELECT c.id FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
        WHERE c.is_active = true
      )
      SELECT id FROM category_tree;
    `, [parentId]);

    return rows.map(row => row.id);
  }

  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC'
      );

      // Lấy số lượng sản phẩm cho mỗi category
      for (let category of rows) {
        // Lấy tất cả ID của danh mục con
        const childIds = await this.getAllChildIds(category.id);
        const allCategoryIds = [category.id, ...childIds];
        
        // Đếm tổng số sản phẩm (bao gồm cả danh mục con)
        const totalProducts = await Product.countDocuments({
          categoryId: { $in: allCategoryIds },
          isActive: true
        });
        
        category.totalProducts = totalProducts;
      }

      return rows;
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  }

  static async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ? AND is_active = true',
      [id]
    );
    
    if (rows[0]) {
      // Lấy tất cả ID của danh mục con
      const childIds = await this.getAllChildIds(rows[0].id);
      const allCategoryIds = [rows[0].id, ...childIds];
      
      // Đếm tổng số sản phẩm
      const totalProducts = await Product.countDocuments({
        categoryId: { $in: allCategoryIds },
        isActive: true
      });
      
      rows[0].totalProducts = totalProducts;
    }
    
    return rows[0];
  }

  static async getBySlug(slug) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE slug = ? AND is_active = true',
      [slug]
    );
    
    if (rows[0]) {
      // Lấy tất cả ID của danh mục con
      const childIds = await this.getAllChildIds(rows[0].id);
      const allCategoryIds = [rows[0].id, ...childIds];
      
      // Đếm tổng số sản phẩm
      const totalProducts = await Product.countDocuments({
        categoryId: { $in: allCategoryIds },
        isActive: true
      });
      
      rows[0].totalProducts = totalProducts;
    }
    
    return rows[0];
  }

  static async getSubcategories(parentId) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE parent_id = ? AND is_active = true ORDER BY sort_order ASC',
      [parentId]
    );

    // Lấy số lượng sản phẩm cho mỗi danh mục con
    for (let category of rows) {
      // Lấy tất cả ID của danh mục con
      const childIds = await this.getAllChildIds(category.id);
      const allCategoryIds = [category.id, ...childIds];
      
      // Đếm tổng số sản phẩm
      const totalProducts = await Product.countDocuments({
        categoryId: { $in: allCategoryIds },
        isActive: true
      });
      
      category.totalProducts = totalProducts;
    }

    return rows;
  }


  static async getCategoryPath(categoryId) {
    const [rows] = await pool.query(`
      WITH RECURSIVE category_path AS (
        SELECT id, name, slug, parent_id, 1 as level
        FROM categories
        WHERE id = ?
        
        UNION ALL
        
        SELECT c.id, c.name, c.slug, c.parent_id, cp.level + 1
        FROM categories c
        INNER JOIN category_path cp ON c.id = cp.parent_id
      )
      SELECT * FROM category_path ORDER BY level DESC
    `, [categoryId]);

    // Lấy số lượng sản phẩm cho mỗi danh mục trong đường dẫn
    for (let category of rows) {
      const productCount = await Product.countDocuments({
        categoryId: category.id,
        isActive: true
      });
      category.totalProducts = productCount;
    }

    return rows;
  }

  static async create(data) {
    const { name, slug, parent_id, image_url, description, sort_order } = data;
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, parent_id, image_url, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, parent_id, image_url, description, sort_order]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { name, slug, parent_id, image_url, description, sort_order, is_active } = data;
    const [result] = await pool.query(
      `UPDATE categories 
        SET name = ?, slug = ?, parent_id = ?, image_url = ?,
            description = ?, sort_order = ?, is_active = ?
        WHERE id = ?`,
      [name, slug, parent_id, image_url, description, sort_order, is_active, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query(
      'UPDATE categories SET is_active = false WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Category;