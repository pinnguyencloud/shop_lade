const db = require("../config/mysql.config");
const Product = require("../models/mongodb/Product");

class WarehouseExportController {
  static async createExport(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        receiverName,
        phoneNumber,
        createdBy,
        products,
        status,
        notes,
        address,
        ward,
        district,
        province,
        deliveryUnit,
        expectedDeliveryDate,
        deliveryNotes,
      } = req.body;

      const code = `EX${Date.now()}`;

      const [exportResult] = await connection.query(
        `INSERT INTO warehouse_exports 
        (code, receiver_name, phone_number, created_by, status, notes, 
         address, ward, district, province, delivery_unit, 
         expected_delivery_date, delivery_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code,
          receiverName,
          phoneNumber,
          createdBy,
          status === 0 ? "draft" : "completed",
          notes,
          address,
          ward,
          district,
          province,
          deliveryUnit,
          expectedDeliveryDate,
          deliveryNotes,
        ]
      );

      const exportId = exportResult.insertId;
      let totalQuantity = 0;
      let totalPrice = 0;

      for (const product of products) {
        const { _id: productId, attributes } = product;

        for (const attribute of attributes) {
          const { _id: attributeId, stock: quantity, price } = attribute;

          if (status === 1) {
            const currentProduct = await Product.findOne({
              _id: productId,
              "attributes._id": attributeId,
            });

            const currentAttribute = currentProduct.attributes.find(
              (attr) => attr._id.toString() === attributeId.toString()
            );

            if (!currentAttribute || currentAttribute.stock < quantity) {
              throw new Error(
                `Không đủ số lượng tồn kho cho sản phẩm ${currentProduct.productName}`
              );
            }
          }

          await connection.query(
            `INSERT INTO warehouse_export_details 
            (warehouse_export_id, product_id, attribute_id, quantity, price)
            VALUES (?, ?, ?, ?, ?)`,
            [exportId, productId, attributeId, quantity, price]
          );

          if (status === 1) {
            await Product.findOneAndUpdate(
              {
                _id: productId,
                "attributes._id": attributeId,
              },
              {
                $inc: {
                  "attributes.$.stock": -quantity,
                  totalStock: -quantity,
                },
              }
            );
          }

          totalQuantity += quantity;
          totalPrice += quantity * price;
        }
      }

      await connection.query(
        `UPDATE warehouse_exports 
         SET total_quantity = ?, 
             total_price = ?
         WHERE id = ?`,
        [totalQuantity, totalPrice, exportId]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        data: {
          exportId,
          code,
          totalQuantity,
          totalPrice,
          status: status === 0 ? "draft" : "completed",
          address,
          ward,
          district,
          province,
          deliveryUnit,
          expectedDeliveryDate,
          deliveryNotes,
        },
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

  static async updateStatus(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { id } = req.params;
      const { reason } = req.body;

      const [export_] = await connection.query(
        "SELECT * FROM warehouse_exports WHERE id = ? AND status = ?",
        [id, "draft"]
      );

      if (!export_.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu xuất hoặc phiếu đã hoàn tất",
        });
      }

      const [details] = await connection.query(
        "SELECT * FROM warehouse_export_details WHERE warehouse_export_id = ?",
        [id]
      );

      for (const detail of details) {
        const product = await Product.findOne({
          _id: detail.product_id,
          "attributes._id": detail.attribute_id,
        });

        const attribute = product.attributes.find(
          (attr) => attr._id.toString() === detail.attribute_id.toString()
        );

        if (!attribute || attribute.stock < detail.quantity) {
          throw new Error(
            `Không đủ số lượng tồn kho cho sản phẩm ${product.productName}`
          );
        }

        await Product.findOneAndUpdate(
          {
            _id: detail.product_id,
            "attributes._id": detail.attribute_id,
          },
          {
            $inc: {
              "attributes.$.stock": -detail.quantity,
              totalStock: -detail.quantity,
            },
          }
        );
      }

      await connection.query(
        "UPDATE warehouse_exports SET status = ? WHERE id = ?",
        ["completed", id]
      );

      await connection.query(
        `INSERT INTO warehouse_export_history 
        (warehouse_export_id, old_status, new_status, reason)
        VALUES (?, ?, ?, ?)`,
        [id, "draft", "completed", reason]
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

  static async cancelExport(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { id } = req.params;
      const { cancelReason } = req.body;

      const [export_] = await connection.query(
        "SELECT * FROM warehouse_exports WHERE id = ?",
        [id]
      );

      if (!export_.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu xuất",
        });
      }

      if (export_[0].status === "completed") {
        const [details] = await connection.query(
          "SELECT * FROM warehouse_export_details WHERE warehouse_export_id = ?",
          [id]
        );

        for (const detail of details) {
          await Product.findOneAndUpdate(
            {
              _id: detail.product_id,
              "attributes._id": detail.attribute_id,
            },
            {
              $inc: {
                "attributes.$.stock": detail.quantity,
                totalStock: detail.quantity,
              },
            }
          );
        }
      }

      await connection.query(
        "UPDATE warehouse_exports SET status = ?, cancel_reason = ? WHERE id = ?",
        ["cancelled", cancelReason, id]
      );

      await connection.query(
        `INSERT INTO warehouse_export_history 
        (warehouse_export_id, old_status, new_status, reason)
        VALUES (?, ?, ?, ?)`,
        [id, export_[0].status, "cancelled", cancelReason]
      );

      await connection.commit();

      res.json({
        success: true,
        message: "Đã hủy phiếu xuất thành công",
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

  static async getAll(req, res) {
    try {
      const { status, fromDate, toDate, page = 1, limit = 10 } = req.query;
      let query = "SELECT * FROM warehouse_exports WHERE 1=1";
      let params = [];

      if (status === "0") {
        query += " AND status = 'draft'";
      } else if (status === "1") {
        query += " AND status = 'completed'";
      } else if (status === "2") {
        query += " AND status = 'cancelled'";
      }

      if (fromDate) {
        query += " AND created_at >= ?";
        params.push(fromDate);
      }

      if (toDate) {
        query += " AND created_at <= ?";
        params.push(toDate);
      }

      query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
      params.push(Number(limit), (page - 1) * limit);

      const [exports] = await db.query(query, params);

      const exportsWithDetails = await Promise.all(
        exports.map(async (export_) => {
          const [details] = await db.query(
            `SELECT * FROM warehouse_export_details WHERE warehouse_export_id = ?`,
            [export_.id]
          );
          return { ...export_, details };
        })
      );

      const [totalCount] = await db.query(
        "SELECT COUNT(*) as total FROM warehouse_exports",
        []
      );

      res.json({
        success: true,
        data: exportsWithDetails,
        pagination: {
          total: totalCount[0].total,
          page: Number(page),
          lastPage: Math.ceil(totalCount[0].total / limit),
        },
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

      const [export_] = await db.query(
        `SELECT e.*, h.old_status, h.new_status, h.reason, h.created_at as history_date 
         FROM warehouse_exports e
         LEFT JOIN warehouse_export_history h ON e.id = h.warehouse_export_id
         WHERE e.id = ?`,
        [id]
      );

      if (!export_.length) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiếu xuất",
        });
      }

      const [details] = await db.query(
        `SELECT * FROM warehouse_export_details WHERE warehouse_export_id = ?`,
        [id]
      );

      res.json({
        success: true,
        data: {
          ...export_[0],
          details,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = WarehouseExportController;
