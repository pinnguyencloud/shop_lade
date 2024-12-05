const db = require("../config/mysql.config");

class SupplierController {
  // Lấy tất cả nhà cung cấp
  static async getAll(req, res) {
    try {
      const { search, sort } = req.query;
      let query = 'SELECT * FROM suppliers';
      const params = [];

      if (search) {
        // Tách từ khóa tìm kiếm thành các từ riêng lẻ
        const keywords = search.toLowerCase().split(' ');
        const conditions = keywords.map(() => 'LOWER(supplier_name) LIKE ?');
        query += ' WHERE ' + conditions.join(' AND ');
        
        // Thêm % cho mỗi từ khóa để tìm kiếm linh hoạt
        params.push(...keywords.map(keyword => `%${keyword}%`));
      }

      query += ` ORDER BY created_at ${sort === 'asc' ? 'ASC' : 'DESC'}`;

      const [suppliers] = await db.query(query, params);

      if (suppliers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhà cung cấp nào"
        });
      }

      res.json({
        success: true,
        data: suppliers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


  // Lấy nhà cung cấp theo id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const [suppliers] = await db.query(
        'SELECT * FROM suppliers WHERE id = ?',
        [id]
      );

      if (suppliers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhà cung cấp"
        });
      }

      res.json({
        success: true,
        data: suppliers[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Tạo nhà cung cấp mới
  static async create(req, res) {
    try {
      const { supplier_name, address, phone, email, tax_number, cooperation_day, note } = req.body;

      const [result] = await db.query(
        `INSERT INTO suppliers 
        (supplier_name, address, phone, email, tax_number, cooperation_day, note)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [supplier_name, address, phone, email, tax_number, cooperation_day, note]
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

  // Cập nhật nhà cung cấp
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { supplier_name, address, phone, email, tax_number, cooperation_day, note } = req.body;

      const [result] = await db.query(
        `UPDATE suppliers 
         SET supplier_name = ?, 
             address = ?, 
             phone = ?, 
             email = ?, 
             tax_number = ?, 
             cooperation_day = ?, 
             note = ?
         WHERE id = ?`,
        [supplier_name, address, phone, email, tax_number, cooperation_day, note, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhà cung cấp"
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

  // Xóa nhà cung cấp
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const [result] = await db.query(
        'DELETE FROM suppliers WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhà cung cấp"
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
}

module.exports = SupplierController;