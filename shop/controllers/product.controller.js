const Product = require("../models/mongodb/Product");
const upload = require("../config/multer.config");
const mongoose = require("mongoose");

class ProductController {
  static async filter(req, res) {
    try {
      const {
        categories,
        tags,
        colors,
        search,
        productCode,
        sortStock = 'asc',
        page = 1,
        limit = 10,
      } = req.query;
  
      let query = { isActive: true };
  
      if (categories) {
        query.categoryId = { $in: categories.split(",").map(Number) };
      }
  
      if (tags) {
        query.tags = { $in: tags.split(",") };
      }
  
      if (colors) {
        query["attributes.color"] = { $in: colors.split(",") };
      }
  
      if (search && search.trim()) {
        query.productName = {
          $regex: new RegExp(search.trim(), "i"),
        };
      }
  
      if (productCode) {
        query.productCode = {
          $regex: new RegExp(productCode.trim(), "i"),
        };
      }
  
      const products = await Product.find(query)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort({ totalStock: sortStock === 'desc' ? -1 : 1 })
        .exec();
  
      const count = await Product.countDocuments(query);
  
      res.json({
        success: true,
        data: products,
        pagination: {
          total: count,
          page: parseInt(page),
          lastPage: Math.ceil(count / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const products = await Product.find({
        categoryId: parseInt(categoryId),
        isActive: true,
      })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .exec();

      const count = await Product.countDocuments({
        categoryId: parseInt(categoryId),
        isActive: true,
      });

      res.json({
        success: true,
        data: products,
        pagination: {
          total: count,
          page: parseInt(page),
          lastPage: Math.ceil(count / parseInt(limit)),
        },
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
      upload.array("images", 10)(req, res, async function (err) {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Lỗi upload hình ảnh",
          });
        }
  
        try {
          const productData = JSON.parse(req.body.productData);
  
          // Xử lý attributes với stock mặc định là 0
          if (!Array.isArray(productData.attributes)) {
            const attributesMap = new Map();
            const { price, ...attrs } = productData.attributes;
            Object.entries(attrs).forEach(([key, value]) => {
              attributesMap.set(key, value);
            });
  
            productData.attributes = [
              {
                attributes: attributesMap,
                stock: 0, // Stock mặc định là 0
                price: price,
              },
            ];
          } else {
            productData.attributes = productData.attributes.map((attr) => {
              const attributesMap = new Map();
              const { price, ...attrs } = attr;
              Object.entries(attrs).forEach(([key, value]) => {
                attributesMap.set(key, value);
              });
  
              return {
                attributes: attributesMap,
                stock: 0, // Stock mặc định là 0
                price: price,
              };
            });
          }
  
          const existingProduct = await Product.findOne({
            productCode: productData.productCode,
            isActive: true,
          });
  
          if (existingProduct) {
            // Thêm biến thể mới với stock = 0
            productData.attributes.forEach((newAttr) => {
              const variantIndex = existingProduct.attributes.findIndex(
                (attr) => {
                  const existingAttrs = Object.fromEntries(attr.attributes);
                  const newAttrs = Object.fromEntries(newAttr.attributes);
                  return JSON.stringify(existingAttrs) === JSON.stringify(newAttrs);
                }
              );
  
              if (variantIndex === -1) {
                existingProduct.attributes.push({
                  attributes: newAttr.attributes,
                  stock: 0,
                  price: newAttr.price,
                });
              }
            });
  
            // Xử lý hình ảnh mới
            const newImageUrls = req.files
              ? req.files.map((file, index) => ({
                  url: `/uploads/products/${file.filename}`,
                  alt: productData.attributes[index]?.attributes?.Color || "Default",
                  isMain: false,
                }))
              : [];
  
            existingProduct.images = [...existingProduct.images, ...newImageUrls];
  
            const updatedProduct = await Product.findByIdAndUpdate(
              existingProduct._id,
              {
                $set: {
                  attributes: existingProduct.attributes,
                  description: productData.description || existingProduct.description,
                  images: existingProduct.images,
                  totalStock: 0, // Đảm bảo totalStock là 0
                },
              },
              { new: true }
            );
  
            return res.json({
              success: true,
              data: updatedProduct,
              message: "Đã cập nhật sản phẩm",
            });
          }
  
          // Tạo sản phẩm mới
          const slug = productData.productName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") +
            "-" +
            Date.now();
  
          // Xử lý hình ảnh cho sản phẩm mới
          const imageUrls = req.files
            ? req.files.map((file, index) => ({
                url: `/uploads/products/${file.filename}`,
                alt: productData.attributes[index]?.attributes?.Color || "Default",
                isMain: index === 0,
              }))
            : [];
  
          // Tạo sản phẩm với totalStock = 0
          const product = new Product({
            ...productData,
            totalStock: 0,
            attributes: productData.attributes,
            slug,
            images: imageUrls,
            isActive: true,
          });
  
          await product.save();
  
          res.status(201).json({
            success: true,
            data: product,
            message: "Tạo sản phẩm mới thành công",
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: error.message,
          });
        }
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

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
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
      const { attributeId } = req.query;

      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID sản phẩm không hợp lệ",
        });
      }

      const existingProduct = await Product.findOne({
        _id: id,
        isActive: true,
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      // Nếu có attributeId, update attribute cụ thể
      if (attributeId) {
        const attributeIndex = existingProduct.attributes.findIndex(
          (attr) => attr._id.toString() === attributeId
        );

        if (attributeIndex === -1) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy thuộc tính",
          });
        }

        // Update attribute
        const { stock, price, ...attrs } = req.body;
        const attributesMap = new Map();
        Object.entries(attrs).forEach(([key, value]) => {
          attributesMap.set(key, value);
        });

        const oldStock = existingProduct.attributes[attributeIndex].stock;
        existingProduct.attributes[attributeIndex] = {
          ...existingProduct.attributes[attributeIndex].toObject(),
          attributes: attributesMap,
          stock: stock || existingProduct.attributes[attributeIndex].stock,
          price: price || existingProduct.attributes[attributeIndex].price,
        };

        // Cập nhật totalStock
        existingProduct.totalStock =
          existingProduct.totalStock - oldStock + (stock || oldStock);

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            $set: {
              attributes: existingProduct.attributes,
              totalStock: existingProduct.totalStock,
            },
          },
          { new: true }
        );

        return res.json({
          success: true,
          data: updatedProduct,
          message: "Cập nhật thuộc tính thành công",
        });
      }
      // Update toàn bộ sản phẩm
      else {
        upload.array("images", 10)(req, res, async function (err) {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err.message,
            });
          }

          try {
            // Lấy dữ liệu sản phẩm từ form hoặc trực tiếp từ body
            const productData = req.body.productData
              ? JSON.parse(req.body.productData)
              : req.body;

            // Chỉ update images nếu có file mới được upload
            if (req.files && req.files.length > 0) {
              productData.images = req.files.map((file) => ({
                url: file.path,
                alt: file.originalname,
              }));
            }

            // Update sản phẩm và giữ lại images cũ nếu không có images mới
            const updatedProduct = await Product.findByIdAndUpdate(
              id,
              {
                $set: {
                  ...productData,
                  images: productData.images || existingProduct.images,
                },
              },
              { new: true }
            );

            return res.json({
              success: true,
              data: updatedProduct,
              message: "Cập nhật sản phẩm thành công",
            });
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: error.message,
            });
          }
        });
      }
    } catch (error) {
      console.error("Error in update:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { attributeId } = req.query;

      console.log("Deleting product with ID:", id);
      console.log("Attribute ID if exists:", attributeId);

      // Kiểm tra ID hợp lệ
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "ID sản phẩm không hợp lệ",
        });
      }

      // Nếu có attributeId, xóa attribute cụ thể
      if (attributeId) {
        if (!mongoose.Types.ObjectId.isValid(attributeId)) {
          return res.status(400).json({
            success: false,
            message: "ID thuộc tính không hợp lệ",
          });
        }

        const product = await Product.findById(id);
        console.log("Found product:", product);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy sản phẩm",
          });
        }

        // Tìm và xóa attribute
        const attributeIndex = product.attributes.findIndex(
          (attr) => attr._id && attr._id.toString() === attributeId
        );

        console.log("Found attribute at index:", attributeIndex);

        if (attributeIndex === -1) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy thuộc tính cần xóa",
          });
        }

        // Giảm totalStock
        const removedStock = product.attributes[attributeIndex].stock;
        product.totalStock -= removedStock;

        // Xóa attribute khỏi mảng
        product.attributes.splice(attributeIndex, 1);

        // Nếu không còn attribute nào, xóa luôn sản phẩm
        if (product.attributes.length === 0) {
          console.log("No attributes left, deleting product");
          await Product.deleteOne({ _id: id });
          return res.json({
            success: true,
            message: "Xóa sản phẩm thành công vì không còn thuộc tính",
          });
        }

        // Lưu sản phẩm sau khi cập nhật
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            $set: {
              attributes: product.attributes,
              totalStock: product.totalStock,
            },
          },
          { new: true }
        );

        console.log("Updated product:", updatedProduct);

        return res.json({
          success: true,
          data: updatedProduct,
          message: "Xóa thuộc tính thành công",
        });
      }

      // Nếu không có attributeId, xóa toàn bộ sản phẩm
      console.log("Deleting entire product");
      const result = await Product.deleteOne({ _id: id });
      console.log("Delete result:", result);

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json({
        success: true,
        message: "Xóa sản phẩm thành công",
      });
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ProductController;