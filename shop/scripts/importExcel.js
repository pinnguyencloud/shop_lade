const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Product = require("../models/mongodb/Product");
const slugify = require('slugify');

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/shop_lade", {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
    process.exit(1);
  }
}

const filePath = "./datas/products.xlsx";
const workbook = xlsx.readFile(filePath);
const sheet_name_list = workbook.SheetNames;
const worksheet = workbook.Sheets[sheet_name_list[0]];
const data = xlsx.utils.sheet_to_json(worksheet);

const groupedData = {};

data.forEach((row) => {
  const {
    productName,
    productCode,
    categoryId,
    description,
    "attributes.attributes.Color": color,
    "attributes.attributes.Width": width,
    "attributes.price": price,
    "images.url": url,
    "images.alt": alt,
    "images.isMain": isMain,
  } = row;

  if (!groupedData[productCode]) {
    groupedData[productCode] = {
      productName,
      productCode,
      categoryId,
      description,
      attributes: [],
      images: []
    };
  }

  const attributesObject = {};
  if (color) attributesObject.Color = color;
  if (width) attributesObject.Width = width;

  if (Object.keys(attributesObject).length > 0) {
    groupedData[productCode].attributes.push({
      attributes: attributesObject,
      price: parseFloat(price) || 0,
      stock: 0
    });
  }

  if (url) {
    groupedData[productCode].images.push({
      url: url.startsWith('/') ? url : `/${url}`,
      alt: alt || '',
      isMain: isMain === 'true'
    });
  }
});

async function saveProducts() {
  try {
    await connectDB();
    
    for (let productCode in groupedData) {
      const productData = groupedData[productCode];
      
      try {
        // Tăng timeout cho query
        const existingProduct = await Product.findOne({ productCode: productData.productCode })
          .maxTimeMS(20000);

        if (!existingProduct) {
          console.log('Creating slug for:', productData.productName);
          
          const slug = slugify(productData.productName.toString(), { 
            lower: true,
            strict: true 
          });

          const newProduct = new Product({
            productName: productData.productName,
            productCode: productData.productCode,
            categoryId: productData.categoryId,
            description: productData.description,
            attributes: productData.attributes,
            images: productData.images,
            slug: slug,
          });

          await newProduct.save();
          console.log(`Sản phẩm mới ${productData.productName} đã được thêm!`);
        } else {
          console.log(`Sản phẩm ${productData.productName} đã tồn tại.`);
        }
      } catch (err) {
        console.error(`Lỗi khi xử lý sản phẩm ${productData.productName}:`, err);
        continue;
      }
    }
  } catch (err) {
    console.error("Lỗi trong quá trình import:", err);
  } finally {
    await mongoose.connection.close();
  }
}

saveProducts().catch(console.error);