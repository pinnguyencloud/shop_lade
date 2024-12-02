const db = require("../config/mysql.config");

class WarehouseController {
  // Tạo phiếu nhập kho
  static async createImport(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { supplier_id, shipper_name, shipper_phone, notes, products } = req.body;
      const code = `IM${Date.now()}`;

      // 1. Tạo phiếu nhập
      const [importResult] = await connection.query(
        `INSERT INTO warehouse_imports 
        (code, supplier_id, shipper_name, shipper_phone, notes)
        VALUES (?, ?, ?, ?, ?)`,
        [code, supplier_id, shipper_name, shipper_phone, notes]
      );

      const importId = importResult.insertId;
      let totalQuantity = 0;
      let totalPrice = 0;

      // 2. Thêm chi tiết nhập kho
      for (const product of products) {
        const { product_id, quantity, price_per_unit } = product;
        
        await connection.query(
          `INSERT INTO warehouse_import_details 
          (warehouse_import_id, product_id, quantity, price_per_unit)
          VALUES (?, ?, ?, ?)`,
          [importId, product_id, quantity, price_per_unit]
        );

        // Cập nhật hoặc tạo mới tồn kho
        await connection.query(
          `INSERT INTO inventory (product_id, stock_quantity)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE stock_quantity = stock_quantity + ?`,
          [product_id, quantity, quantity]
        );

        totalQuantity += quantity;
        totalPrice += quantity * price_per_unit;
      }

      // 3. Cập nhật tổng số lượng và giá trị
      await connection.query(
        `UPDATE warehouse_imports 
         SET total_quantity = ?, 
             total_price = ?,
             status = 'completed'
         WHERE id = ?`,
        [totalQuantity, totalPrice, importId]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        data: {
          importId,
          code,
          totalQuantity,
          totalPrice
        }
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        message: error.message
      });
    } finally {
      connection.release();
    }
  }

  // Lấy danh sách phiếu nhập
  static async getAllImports(req, res) {
    try {
      const [imports] = await db.query(
        `SELECT wi.*, s.supplier_name
         FROM warehouse_imports wi
         LEFT JOIN suppliers s ON wi.supplier_id = s.id
         ORDER BY wi.created_at DESC`
      );
      res.json({
        success: true,
        data: imports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy chi tiết phiếu nhập
  static async getImportById(req, res) {
    try {
      const { id } = req.params;
      
      // Lấy thông tin phiếu nhập
      const [imports] = await db.query(
        `SELECT wi.*, s.supplier_name
         FROM warehouse_imports wi
         LEFT JOIN suppliers s ON wi.supplier_id = s.id
         WHERE wi.id = ?`,
        [id]
      );

      if (imports.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu nhập"
        });
      }

      // Lấy chi tiết nhập
      const [details] = await db.query(
        `SELECT * FROM warehouse_import_details 
         WHERE warehouse_import_id = ?`,
        [id]
      );

      res.json({
        success: true,
        data: {
          ...imports[0],
          details
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật trạng thái phiếu nhập
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [result] = await db.query(
        `UPDATE warehouse_imports 
         SET status = ?
         WHERE id = ?`,
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu nhập"
        });
      }

      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Kiểm tra tồn kho
  static async checkInventory(req, res) {
    try {
      const { product_id } = req.params;
      const [inventory] = await db.query(
        'SELECT * FROM inventory WHERE product_id = ?',
        [product_id]
      );

      res.json({
        success: true,
        data: inventory[0] || { product_id, stock_quantity: 0 }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy danh sách tồn kho
  static async getAllInventory(req, res) {
    try {
      const [inventory] = await db.query(
        'SELECT * FROM inventory ORDER BY product_id'
      );
      res.json({
        success: true,
        data: inventory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = WarehouseController;