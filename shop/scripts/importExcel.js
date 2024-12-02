const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Product = require("../models/mongodb/Product"); // Model của bạn
const slugify = require('slugify');  // Import slugify

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/shop_lade", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const filePath = "./datas/products.xlsx"; // Đường dẫn tới file Excel

// Đọc file Excel
const workbook = xlsx.readFile(filePath);
const sheet_name_list = workbook.SheetNames;

// Giả sử chỉ có 1 sheet trong file
const worksheet = workbook.Sheets[sheet_name_list[0]];

// Chuyển dữ liệu từ sheet thành JSON
const data = xlsx.utils.sheet_to_json(worksheet);

// Mã để nhóm dữ liệu
const groupedData = {};

data.forEach((row) => {
  const {
    productName,
    productCode,
    categoryId,
    description,
    "attributes.Color": color,
    "attributes.Width": width,
    "attributes.stock": stock,
    "attributes.price": price,
    "images.url": url,
    "images.alt": alt,
    "images.isMain": isMain,
  } = row;

  // Kiểm tra xem sản phẩm này đã tồn tại chưa
  if (!groupedData[productCode]) {
    groupedData[productCode] = {
      productName,
      productCode,
      categoryId,
      description,
      attributes: [],
      images: [],
      totalStock: 0, // Khởi tạo totalStock
    };
  }

  // Tạo đối tượng cho attributes (sử dụng object thay vì Map)
  const attributeObj = {
    Color: color,
    Width: width,
    stock: stock,
    price: price,
  };

  // Thêm attribute vào mảng attributes
  groupedData[productCode].attributes.push(attributeObj);

  // Cộng dồn totalStock từ các attributes
  groupedData[productCode].totalStock += stock;

  // Thêm image
  groupedData[productCode].images.push({ url, alt, isMain: isMain === "true" }); // isMain cần chuyển đổi từ chuỗi sang Boolean
});

// Lưu dữ liệu vào MongoDB
async function saveProducts() {
  for (let productCode in groupedData) {
    const productData = groupedData[productCode];
    // Tạo slug từ productName
    const slug = slugify(productData.productName, { lower: true });
    
    const newProduct = new Product({
      productName: productData.productName,
      productCode: productData.productCode,
      categoryId: productData.categoryId,
      description: productData.description,
      attributes: productData.attributes,
      images: productData.images,
      totalStock: productData.totalStock, // Gán totalStock vào sản phẩm
      slug: slug, // Thêm slug vào sản phẩm
    });

    try {
      await newProduct.save();
      console.log(
        `Product ${productData.productName} đã được lưu vào MongoDB!`
      );
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
    }
  }
}

saveProducts();
