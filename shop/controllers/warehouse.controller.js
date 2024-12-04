const db = require("../config/mysql.config");
const Product = require("../models/mongodb/Product");

class WarehouseController {
  // Tạo phiếu nhập kho
  static async createImport(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
  
      const {
        supplierId,
        deliveryPerson,
        phoneNumber,
        createdBy,
        products,
        status,
        notes,
      } = req.body;
  
      // 1. Validate data
      if (!products || products.length === 0) {
        throw new Error("Vui lòng nhập sản phẩm cho phiếu nhập");
      }
  
      // 2. Validate supplier
      const [supplier] = await connection.query(
        "SELECT id FROM suppliers WHERE id = ?",
        [supplierId]
      );
  
      if (!supplier.length) {
        throw new Error("Nhà cung cấp không tồn tại trong hệ thống");
      }
  
      // 3. Validate sản phẩm và thuộc tính
      for (const product of products) {
        // Kiểm tra sản phẩm tồn tại
        const productExists = await Product.findById(product._id);
        if (!productExists) {
          throw new Error(`Sản phẩm với ID [${product._id}] không tồn tại trong hệ thống`);
        }
  
        if (!product.attributes || product.attributes.length === 0) {
          throw new Error(`Vui lòng nhập thuộc tính cho sản phẩm ${productExists.productName}`);
        }
  
        // Kiểm tra từng thuộc tính của sản phẩm
        for (const attr of product.attributes) {
          const attributeExists = productExists.attributes.some(
            a => a._id.toString() === attr._id
          );
          if (!attributeExists) {
            throw new Error(
              `Thuộc tính với ID [${attr._id}] không tồn tại trong sản phẩm ${productExists.productName}`
            );
          }
  
          // Validate số lượng và giá
          if (!attr.stock || attr.stock <= 0) {
            throw new Error(
              `Vui lòng nhập số lượng lớn hơn 0 cho thuộc tính [${attr._id}] của sản phẩm ${productExists.productName}`
            );
          }
  
          if (!attr.price || attr.price <= 0) {
            throw new Error(
              `Vui lòng nhập giá lớn hơn 0 cho thuộc tính [${attr._id}] của sản phẩm ${productExists.productName}`
            );
          }
        }
      }
  
      // 4. Tạo phiếu nhập
      const code = `IM${Date.now()}`;
      const [importResult] = await connection.query(
        `INSERT INTO warehouse_imports 
        (code, supplier_id, delivery_person, phone_number, created_by, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          code,
          supplierId,
          deliveryPerson,
          phoneNumber,
          createdBy,
          status === 0 ? "draft" : "completed",
          notes,
        ]
      );
  
      const importId = importResult.insertId;
      let totalQuantity = 0;
      let totalPrice = 0;
  
      // 5. Tạo chi tiết phiếu nhập và cập nhật tồn kho
      for (const product of products) {
        const { _id: productId, attributes } = product;
  
        for (const attribute of attributes) {
          const { _id: attributeId, stock: quantity, price } = attribute;
          const total_price = quantity * price;
  
          // Insert chi tiết phiếu nhập
          await connection.query(
            `INSERT INTO warehouse_import_details 
            (warehouse_import_id, product_id, attribute_id, quantity, price, total_price)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [importId, productId, attributeId, quantity, price, total_price]
          );
  
          // Cập nhật tồn kho nếu trạng thái là completed
          if (status === 1) {
            await this.updateProductStock(productId, attributeId, quantity);
          }
  
          totalQuantity += quantity;
          totalPrice += total_price;
        }
      }
  
      // 6. Cập nhật tổng số lượng và tổng tiền
      await connection.query(
        `UPDATE warehouse_imports 
         SET total_quantity = ?, 
             total_price = ?
         WHERE id = ?`,
        [totalQuantity, totalPrice, importId]
      );
  
      await connection.commit();
  
      // 7. Trả về kết quả
      res.status(201).json({
        success: true,
        data: {
          importId,
          code,
          supplierId,
          totalQuantity,
          totalPrice,
          status: status === 0 ? "draft" : "completed",
        },
      });
  
    } catch (error) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } finally {
      connection.release();
    }
  }
  
  // Hàm cập nhật tồn kho MongoDB
  static async updateProductStock(productId, attributeId, quantity) {
    await Product.findOneAndUpdate(
      {
        _id: productId,
        "attributes._id": attributeId,
      },
      {
        $inc: {
          "attributes.$.stock": quantity,
          totalStock: quantity,
        },
      }
    );
  }

  // Hàm hỗ trợ cập nhật tồn kho sản phẩm trong MongoDB
  static async updateProductStock(productId, attributeId, quantity) {
    await Product.findOneAndUpdate(
      {
        _id: productId,
        "attributes._id": attributeId,
      },
      {
        $inc: {
          "attributes.$.stock": quantity,
          totalStock: quantity,
        },
      }
    );
  }

  // Cập nhật trạng thái phiếu nhập
  static async updateImportStatus(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { id } = req.params;

      // Kiểm tra phiếu nhập tồn tại
      const [importExists] = await connection.query(
        "SELECT * FROM warehouse_imports WHERE id = ? AND status = ?",
        [id, "draft"]
      );

      if (!importExists.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu nhập hoặc phiếu đã hoàn tất",
        });
      }

      // Lấy chi tiết nhập
      const [details] = await connection.query(
        "SELECT * FROM warehouse_import_details WHERE warehouse_import_id = ?",
        [id]
      );

      // Cập nhật tồn kho cho từng sản phẩm
      for (const detail of details) {
        await this.updateProductStock(
          detail.product_id,
          detail.attribute_id,
          detail.quantity
        );
      }

      // Cập nhật trạng thái phiếu nhập
      await connection.query(
        "UPDATE warehouse_imports SET status = ? WHERE id = ?",
        ["completed", id]
      );

      await connection.commit();

      res.json({
        success: true,
        message: "Đã chuyển trạng thái thành công",
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } finally {
      connection.release();
    }
  }

  // Lấy danh sách phiếu nhập
  static async getAllImports(req, res) {
    try {
      const {
        status,
        supplierId,
        createdBy,
        code,
        page = 1,
        limit = 10,
      } = req.query;
      const offset = (page - 1) * limit;

      let sqlQuery = `
        SELECT wi.*, s.supplier_name, 
        GROUP_CONCAT(wid.quantity) as quantities
        FROM warehouse_imports wi
        JOIN suppliers s ON wi.supplier_id = s.id
        LEFT JOIN warehouse_import_details wid ON wi.id = wid.warehouse_import_id
        WHERE 1=1
      `;

      let countQuery = `
        SELECT COUNT(DISTINCT wi.id) as total
        FROM warehouse_imports wi
        WHERE 1=1
      `;

      const params = [];
      const countParams = [];

      if (status !== undefined) {
        sqlQuery += " AND wi.status = ?";
        countQuery += " AND wi.status = ?";
        params.push(status === "0" ? "draft" : "completed");
        countParams.push(status === "0" ? "draft" : "completed");
      }

      if (supplierId) {
        sqlQuery += " AND wi.supplier_id = ?";
        countQuery += " AND wi.supplier_id = ?";
        params.push(supplierId);
        countParams.push(supplierId);
      }

      if (createdBy) {
        sqlQuery += " AND wi.created_by = ?";
        countQuery += " AND wi.created_by = ?";
        params.push(createdBy);
        countParams.push(createdBy);
      }

      if (code) {
        sqlQuery += " AND wi.code LIKE ?";
        countQuery += " AND wi.code LIKE ?";
        params.push(`%${code}%`);
        countParams.push(`%${code}%`);
      }

      sqlQuery += " GROUP BY wi.id, wi.code, wi.status, wi.created_at";
      sqlQuery += " ORDER BY wi.created_at DESC";
      sqlQuery += " LIMIT ? OFFSET ?";
      params.push(Number(limit), Number(offset));

      const [imports] = await db.query(sqlQuery, params);
      const [totalRows] = await db.query(countQuery, countParams);

      const importsWithDetails = await Promise.all(
        imports.map(async (import_) => {
          const [details] = await db.query(
            `SELECT * FROM warehouse_import_details WHERE warehouse_import_id = ?`,
            [import_.id]
          );
          return { ...import_, details };
        })
      );

      res.json({
        success: true,
        data: importsWithDetails,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalRows[0].total,
          totalPages: Math.ceil(totalRows[0].total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy chi tiết phiếu nhập theo ID

  static async getImportById(req, res) {
    try {
      const { id } = req.params;

      // Get basic import information with supplier details
      const [import_] = await db.query(
        `SELECT wi.*, s.supplier_name, s.phone, s.email, s.address
         FROM warehouse_imports wi
         LEFT JOIN suppliers s ON wi.supplier_id = s.id
         WHERE wi.id = ?`,
        [id]
      );

      if (import_.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu nhập",
        });
      }

      // Get import details with product IDs and attribute IDs
      const [details] = await db.query(
        `SELECT * FROM warehouse_import_details WHERE warehouse_import_id = ?`,
        [id]
      );

      // Get product details from MongoDB for each detail line
      const detailsWithProducts = await Promise.all(
        details.map(async (detail) => {
          const product = await Product.findOne(
            {
              _id: detail.product_id,
              "attributes._id": detail.attribute_id,
            },
            {
              productName: 1,
              productCode: 1,
              "attributes.$": 1, // Chỉ lấy attribute match với điều kiện
            }
          ).lean();

          if (!product) {
            return {
              ...detail,
              productName: "Sản phẩm không tồn tại",
              productCode: "N/A",
              attribute: null,
            };
          }

          return {
            quantity: detail.quantity,
            price: detail.price,
            productName: product.productName,
            productCode: product.productCode,
            attribute: product.attributes[0], // Do chúng ta đã lọc chính xác attribute cần thiết
            totalAmount: detail.quantity * detail.price,
          };
        })
      );

      res.json({
        success: true,
        data: {
          ...import_[0],
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
  static async getWarehouseHistory(req, res) {
    let connection;
    try {
      connection = await db.getConnection();

      const [history] = await connection.query(`
        SELECT 
          wi.*,
          GROUP_CONCAT(wid.quantity) as quantities 
        FROM warehouse_imports wi
        LEFT JOIN warehouse_import_details wid ON wi.id = wid.warehouse_import_id
        WHERE wi.status = 'completed'
        GROUP BY wi.id, wi.code, wi.status, wi.created_at
        ORDER BY wi.created_at DESC
      `);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }

  static async checkLowStockAndNotify(req, res) {
    try {
      const products = await Product.find({
        "attributes.stock": { $lt: 10 },
      }).select("productName productCode attributes");

      const lowStockItems = products.map((product) => ({
        productId: product._id,
        productName: product.productName,
        productCode: product.productCode,
        lowStockAttributes: product.attributes
          .filter((attr) => attr.stock < 10)
          .map((attr) => ({
            id: attr._id,
            stock: attr.stock,
            suggestedOrder: 100 - attr.stock, // Số lượng cần nhập để đạt mức 100
          })),
      }));

      res.json({
        success: true,
        data: lowStockItems,
        message:
          lowStockItems.length > 0
            ? `Có ${lowStockItems.length} sản phẩm sắp hết hàng`
            : "Không có sản phẩm nào sắp hết hàng",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = WarehouseController;
