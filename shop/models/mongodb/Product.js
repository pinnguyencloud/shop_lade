const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 5000,
    },
    categoryId: {
      type: Number,
      required: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    attributes: [
      {
        // Lưu trữ các thuộc tính như "Color", "Width", v.v.
        attributes: {
          type: Map,
          of: mongoose.Schema.Types.Mixed,
        },
        stock: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    images: [
      {
        url: String,
        alt: String,
        isMain: Boolean,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware trước khi lưu tài liệu (pre-save)
productSchema.pre("save", function (next) {
  if (this.attributes && Array.isArray(this.attributes)) {
    // Tính tổng số lượng stock từ tất cả các attributes
    this.totalStock = this.attributes.reduce(
      (total, attribute) => total + attribute.stock,
      0
    );
  } else {
    this.totalStock = 0; // Nếu không có attributes thì set totalStock là 0
  }
  next();
});

// Tạo text index cho tìm kiếm
productSchema.index({ productName: "text", description: "text" });

const Product = mongoose.model("Product", productSchema,);
module.exports = Product;
