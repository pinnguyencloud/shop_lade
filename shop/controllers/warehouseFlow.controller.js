const db = require("../config/mysql.config");
const Product = require("../models/mongodb/Product");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class WarehouseFlowController {
  // 1. Tìm sản phẩm theo mã code
  static async findProduct(req, res) {
    try {
      const { code } = req.params;
      
      // Tìm sản phẩm từ MongoDB
      const product = await Product.findOne({ productCode: code });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm"
        });
      }

      // Tính tổng số lượng từ attributes trong MongoDB
      const totalStock = product.totalStock || 0;

      // Cập nhật hoặc tạo mới trong bảng inventory MySQL
      const [inventoryResult] = await db.query(
        `INSERT INTO inventory (product_id, stock_quantity) 
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE stock_quantity = ?`,
        [product._id.toString(), totalStock, totalStock]
      );

      res.json({
        success: true,
        data: {
          product: {
            id: product._id,
            code: product.productCode,
            name: product.productName,
            price: product.price,
            category_id: product.categoryId,
            description: product.description,
            image_url: product.images && product.images[0] ? product.images[0].url : null
          },
          stock: totalStock
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
}

  // 2. Preview phiếu xuất trước khi tạo
  static async previewExport(req, res) {
    try {
      const { products, customerInfo } = req.body;

      // Kiểm tra tồn kho cho tất cả sản phẩm
      for (const item of products) {
        const [stockResult] = await db.query(
          "SELECT stock_quantity FROM inventory WHERE product_id = ?",
          [item.product_id]
        );

        if (!stockResult[0] || stockResult[0].stock_quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Không đủ tồn kho cho sản phẩm ${item.product_id}`,
          });
        }
      }

      // Lấy thông tin chi tiết sản phẩm từ MongoDB
      const productDetails = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.product_id);
          return {
            ...item,
            productName: product.name,
            productCode: product.code,
          };
        })
      );

      // Tính tổng tiền
      const totalAmount = productDetails.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      // Tạo preview data
      const previewData = {
        code: `EX${Date.now()}`,
        customerInfo,
        products: productDetails,
        totalAmount,
        totalQuantity: productDetails.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        previewDate: new Date(),
      };

      res.json({
        success: true,
        data: previewData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 3. Tạo phiếu xuất và chi tiết
 // 3. Tạo phiếu xuất và chi tiết
static async createExport(req, res) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    console.log("Request body:", req.body); // Thêm log để debug

    const { customerInfo, products, notes } = req.body;

    // Validate input
    if (!customerInfo || !products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Invalid input data");
    }

    // 3.1 Tạo phiếu xuất
    const exportCode = `EX${Date.now()}`;
    const [exportResult] = await connection.query(
      `INSERT INTO warehouse_exports 
       (code, customer_name, customer_phone, customer_address, 
        export_date, total_quantity, total_amount, status, notes)
       VALUES (?, ?, ?, ?, NOW(), 0, 0, 'pending', ?)`,
      [exportCode, customerInfo.name, customerInfo.phone, customerInfo.address, notes]
    );

    const exportId = exportResult.insertId;
    let totalQuantity = 0;
    let totalAmount = 0;

    // 3.2 Tạo chi tiết xuất kho và cập nhật tồn kho
    for (const product of products) {
      // Lấy thông tin sản phẩm từ MongoDB
      const productFromMongo = await Product.findById(product.product_id);
      if (!productFromMongo) {
        throw new Error(`Không tìm thấy sản phẩm ${product.product_id}`);
      }

      // Kiểm tra tồn kho từ MongoDB
      if (productFromMongo.totalStock < product.quantity) {
        throw new Error(`Không đủ tồn kho cho sản phẩm ${productFromMongo.productName}`);
      }

      // Thêm chi tiết xuất
      await connection.query(
        `INSERT INTO warehouse_export_details 
         (export_id, product_id, category_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [exportId, product.product_id, productFromMongo.categoryId, product.quantity, product.price]
      );

      // Cập nhật tồn kho trong MongoDB
      await Product.findByIdAndUpdate(product.product_id, {
        $inc: { totalStock: -product.quantity }
      });

      // Cập nhật hoặc tạo mới trong bảng inventory MySQL
      await connection.query(
        `INSERT INTO inventory (product_id, stock_quantity) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE stock_quantity = stock_quantity - ?`,
        [product.product_id, productFromMongo.totalStock - product.quantity, product.quantity]
      );

      totalQuantity += product.quantity;
      totalAmount += product.quantity * product.price;
    }

    // 3.3 Cập nhật tổng số lượng và tổng tiền
    await connection.query(
      `UPDATE warehouse_exports 
       SET total_quantity = ?, 
           total_amount = ?,
           status = 'completed'
       WHERE id = ?`,
      [totalQuantity, totalAmount, exportId]
    );

    await connection.commit();

    // 3.4 Tạo PDF
    const pdfPath = await WarehouseFlowController.generatePDF({
      id: exportId,
      code: exportCode,
      customerInfo,
      products: await Promise.all(products.map(async (p) => {
        const product = await Product.findById(p.product_id);
        return {
          ...p,
          product_name: product.productName,
          product_code: product.productCode
        };
      })),
      totalQuantity,
      totalAmount,
      notes,
      export_date: new Date()
    });

    res.status(201).json({
      success: true,
      data: {
        exportId,
        exportCode,
        pdfUrl: pdfPath,
        totalQuantity,
        totalAmount
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

  // 4. Lấy danh sách phiếu xuất
  static async getAllExports(req, res) {
    try {
      const [exports] = await db.query(
        `SELECT e.*, 
                COUNT(d.id) as total_items
         FROM warehouse_exports e
         LEFT JOIN warehouse_export_details d ON e.id = d.export_id
         GROUP BY e.id
         ORDER BY e.created_at DESC`
      );

      res.json({
        success: true,
        data: exports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 5. Lấy chi tiết phiếu xuất
  static async getExportDetail(req, res) {
    try {
      const { id } = req.params;

      // 5.1 Lấy thông tin phiếu xuất
      const [exports] = await db.query(
        `SELECT * FROM warehouse_exports WHERE id = ?`,
        [id]
      );

      if (exports.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu xuất",
        });
      }

      // 5.2 Lấy chi tiết phiếu xuất
      const [details] = await db.query(
        `SELECT d.*,
                c.name as category_name
         FROM warehouse_export_details d
         LEFT JOIN categories c ON d.category_id = c.id
         WHERE d.export_id = ?`,
        [id]
      );

      // 5.3 Lấy thông tin sản phẩm từ MongoDB
      const detailsWithProducts = await Promise.all(
        details.map(async (detail) => {
          const product = await Product.findById(detail.product_id);
          return {
            ...detail,
            product_name: product ? product.name : "Unknown Product",
            product_code: product ? product.code : "N/A",
          };
        })
      );

      res.json({
        success: true,
        data: {
          ...exports[0],
          details: detailsWithProducts,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 6. In phiếu xuất
  static async printExport(req, res) {
    try {
      const { id } = req.params;
      const exportData = await WarehouseFlowController.getFullExportData(id);

      if (!exportData) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu xuất",
        });
      }

      // Chỉ tạo PDF và trả về đường dẫn
      const pdfPath = await WarehouseFlowController.generatePDF(exportData);

      res.json({
        success: true,
        message: "Đã tạo PDF thành công",
        data: {
          pdfUrl: pdfPath,
          exportData, // Trả thêm data để frontend có thể xử lý in nếu cần
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 7. Lấy dữ liệu đầy đủ của phiếu xuất
  static async getFullExportData(exportId) {
    const [exports] = await db.query(
      `SELECT * FROM warehouse_exports WHERE id = ?`,
      [exportId]
    );

    if (exports.length === 0) return null;

    const [details] = await db.query(
      `SELECT d.*, c.name as category_name
       FROM warehouse_export_details d
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.export_id = ?`,
      [exportId]
    );

    const detailsWithProducts = await Promise.all(
      details.map(async (detail) => {
        const product = await Product.findById(detail.product_id);
        return {
          ...detail,
          product_name: product ? product.name : "Unknown Product",
          product_code: product ? product.code : "N/A",
        };
      })
    );

    return {
      ...exports[0],
      details: detailsWithProducts,
    };
  }

  // 8. Tạo file PDF
  static async generatePDF(data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const fileName = `export-${data.code}-${Date.now()}.pdf`;
        const filePath = path.join(__dirname, "../uploads/exports", fileName);

        // Ensure directory exists
        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        doc.pipe(fs.createWriteStream(filePath));

        // Header
        doc.fontSize(20).text("PHIẾU XUẤT KHO", { align: "center" });
        doc.moveDown();

        // Export info
        doc
          .fontSize(12)
          .text(`Mã phiếu: ${data.code}`)
          .text(
            `Ngày xuất: ${new Date(data.export_date).toLocaleDateString(
              "vi-VN"
            )}`
          )
          .text(`Khách hàng: ${data.customerInfo.name}`)
          .text(`Địa chỉ: ${data.customerInfo.address}`)
          .text(`Điện thoại: ${data.customerInfo.phone}`);
        doc.moveDown();

        // Table header
        const tableTop = doc.y + 20;
        doc
          .text("STT", 50, tableTop)
          .text("Mã SP", 100, tableTop)
          .text("Tên SP", 200, tableTop)
          .text("SL", 300, tableTop)
          .text("Đơn giá", 350, tableTop)
          .text("Thành tiền", 450, tableTop);

        // Table content
        let y = tableTop + 20;
        data.details.forEach((item, index) => {
          doc
            .text(String(index + 1), 50, y)
            .text(item.product_code, 100, y)
            .text(item.product_name, 200, y)
            .text(String(item.quantity), 300, y)
            .text(String(item.price), 350, y)
            .text(String(item.price * item.quantity), 450, y);
          y += 20;
        });

        // Totals
        doc
          .moveDown()
          .text(`Tổng số lượng: ${data.totalQuantity}`, { align: "right" })
          .text(`Tổng tiền: ${data.totalAmount.toLocaleString("vi-VN")} VNĐ`, {
            align: "right",
          });

        // Notes
        if (data.notes) {
          doc.moveDown().text("Ghi chú:", { underline: true }).text(data.notes);
        }

        // Signatures
        doc.moveDown().moveDown();
        const signatureTop = doc.y;
        doc
          .text("Người lập phiếu", 50, signatureTop, { align: "center" })
          .text("Người nhận hàng", 250, signatureTop, { align: "center" })
          .text("Thủ kho", 450, signatureTop, { align: "center" });

        doc
          .text("(Ký, họ tên)", 50, signatureTop + 20, { align: "center" })
          .text("(Ký, họ tên)", 250, signatureTop + 20, { align: "center" })
          .text("(Ký, họ tên)", 450, signatureTop + 20, { align: "center" });

        doc.end();
        resolve(`/uploads/exports/${fileName}`);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = WarehouseFlowController;
