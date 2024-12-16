const db = require("../config/mysql.config");
const Product = require("../models/mongodb/Product");

class DashboardController {
  static async getOverview(req, res) {
    try {
      const connection = await db.getConnection();
      const [customerCount] = await connection.query(
        "SELECT COUNT(*) as count FROM customers WHERE is_active = true"
      );

      const [supplierCount] = await connection.query(
        "SELECT COUNT(*) as count FROM suppliers"
      );

      const [importStats] = await connection.query(`
        SELECT 
          SUM(total_price) as total_import_value,
          SUM(total_quantity) as total_import_quantity
        FROM warehouse_imports 
        WHERE status = 'completed'
      `);

      const [exportStats] = await connection.query(`
        SELECT 
          SUM(total_price) as total_export_value,
          SUM(total_quantity) as total_export_quantity
        FROM warehouse_exports 
        WHERE status = 'completed'
      `);

      const productCount = await Product.countDocuments({ isActive: true });

      const lowStockProducts = await Product.countDocuments({
        "attributes.stock": { $lt: 10 },
      });

      connection.release();

      res.json({
        success: true,
        data: {
          customers: customerCount[0].count,
          suppliers: supplierCount[0].count,
          products: productCount,
          lowStock: lowStockProducts,
          imports: {
            value: importStats[0].total_import_value || 0,
            quantity: importStats[0].total_import_quantity || 0,
          },
          exports: {
            value: exportStats[0].total_export_value || 0,
            quantity: exportStats[0].total_export_quantity || 0,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getSalesStats(req, res) {
    try {
      const [monthlyStats] = await db.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          SUM(total_price) as revenue,
          COUNT(*) as order_count,
          SUM(total_quantity) as total_items
        FROM warehouse_exports
        WHERE status = 'completed'
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
        LIMIT 12
      `);

      res.json({
        success: true,
        data: monthlyStats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getTopProducts(req, res) {
    try {
      const [topProducts] = await db.query(`
        SELECT 
          wed.product_id,
          SUM(wed.quantity) as total_sold,
          SUM(wed.quantity * wed.price) as total_revenue
        FROM warehouse_export_details wed
        JOIN warehouse_exports we ON wed.warehouse_export_id = we.id
        WHERE we.status = 'completed'
        GROUP BY wed.product_id
        ORDER BY total_sold DESC
        LIMIT 10
      `);

      const productsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await Product.findById(item.product_id, {
            productName: 1,
            productCode: 1,
          });
          return {
            ...item,
            productName: product?.productName || "Sản phẩm không tồn tại",
            productCode: product?.productCode || "N/A",
          };
        })
      );

      res.json({
        success: true,
        data: productsWithDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getStockStatus(req, res) {
    try {
      const stockSummary = await Product.aggregate([
        { $match: { isActive: true } },
        {
          $project: {
            productName: 1,
            productCode: 1,
            totalStock: 1,
            stockStatus: {
              $switch: {
                branches: [
                  { case: { $lt: ["$totalStock", 10] }, then: "low" },
                  { case: { $lt: ["$totalStock", 50] }, then: "medium" },
                  { case: { $gte: ["$totalStock", 50] }, then: "good" },
                ],
                default: "unknown",
              },
            },
          },
        },
        {
          $group: {
            _id: "$stockStatus",
            count: { $sum: 1 },
            products: { $push: "$$ROOT" },
          },
        },
      ]);

      res.json({
        success: true,
        data: stockSummary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = DashboardController;
