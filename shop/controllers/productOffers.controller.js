const db = require("../config/mysql.config");

class ProductOffersController {
  // Tạo báo giá mới
  static async create(req, res) {
    try {
      const { supplier_id, product_id, import_price, tax_number, note } = req.body;

      const [result] = await db.query(
        `INSERT INTO product_offers 
        (supplier_id, product_id, import_price, tax_number, note)
        VALUES (?, ?, ?, ?, ?)`,
        [supplier_id, product_id, import_price, tax_number, note]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy tất cả báo giá
  static async getAll(req, res) {
    try {
      const [offers] = await db.query(
        `SELECT po.*, s.supplier_name
         FROM product_offers po
         LEFT JOIN suppliers s ON po.supplier_id = s.id
         ORDER BY po.supplier_id`
      );
      res.json({
        success: true,
        data: offers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy báo giá theo id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const [offers] = await db.query(
        `SELECT po.*, s.supplier_name
         FROM product_offers po
         LEFT JOIN suppliers s ON po.supplier_id = s.id
         WHERE po.id = ?`,
        [id]
      );

      if (offers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy báo giá"
        });
      }

      res.json({
        success: true,
        data: offers[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật báo giá
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { import_price, tax_number, note } = req.body;

      const [result] = await db.query(
        `UPDATE product_offers 
         SET import_price = ?,
             tax_number = ?,
             note = ?
         WHERE id = ?`,
        [import_price, tax_number, note, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy báo giá"
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thành công"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa báo giá
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const [result] = await db.query(
        'DELETE FROM product_offers WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy báo giá"
        });
      }

      res.json({
        success: true,
        message: "Xóa thành công"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

   // Lấy báo giá theo nhà cung cấp
   static async getBySupplier(req, res) {
    try {
      const { supplierId } = req.params;
      const [offers] = await db.query(
        `SELECT po.*, s.supplier_name
         FROM product_offers po
         LEFT JOIN suppliers s ON po.supplier_id = s.id
         WHERE po.supplier_id = ?`,
        [supplierId]
      );
      res.json({
        success: true,
        data: offers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProductOffersController;