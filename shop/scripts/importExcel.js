const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Product = require("../models/mongodb/Product");
const slugify = require('slugify');

mongoose
  .connect("mongodb://localhost:27017/shop_lade", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

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

  // Thay đổi cách tạo attributes
  const attributesObject = {};
  if (color) attributesObject.Color = color;
  if (width) attributesObject.Width = width;

  groupedData[productCode].attributes.push({
    attributes: {
      attributes: attributesObject
    },
    price: parseFloat(price) || 0,
    stock: 0
  });

  if (url) {
    groupedData[productCode].images.push({
      url: url.startsWith('/') ? url : `/${url}`,
      alt: alt || '',
      isMain: isMain === 'true'
    });
  }
});

async function saveProducts() {
  for (let productCode in groupedData) {
    const productData = groupedData[productCode];

    try {
      const existingProduct = await Product.findOne({ productCode: productData.productCode });
      
      if (!existingProduct) {
        // Log trước khi tạo slug
        console.log('Creating slug for:', productData.productName);
        
        const slug = slugify(productData.productName.toString(), { lower: true });
        
        const newProduct = new Product({
          productName: productData.productName,
          productCode: productData.productCode,
          categoryId: productData.categoryId,
          description: productData.description,
          attributes: productData.attributes,
          images: productData.images,
          totalStock: productData.totalStock,
          slug: slug,
        });
        
        await newProduct.save();
        console.log(`Sản phẩm mới ${productData.productName} đã được thêm vào MongoDB!`);
      } else {
        console.log(`Sản phẩm ${productData.productName} đã tồn tại, bỏ qua cập nhật.`);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý sản phẩm:", err, productData);
    }
  }
}

saveProducts();