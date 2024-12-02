// const transformProductData = (input) => {
//   return {
//     productName: input.productName,
//     productCode: input.productCode,
//     description: input.description,
//     categoryId: input.categoryId,
//     slug: input.slug,
//     totalStock: input.attributes.reduce((sum, attr) => sum + attr.stock, 0),
//     attributes: input.attributes.map((attr) => ({
//       attributes: new Map([
//         ["Width", "10"],
//         ["Color", attr.alt || "Default"],
//       ]),
//       stock: attr.stock,
//       price: attr.price,
//     })),
//     images: input.images,
//     isActive: input.isActive,
//   };
// };

// module.exports = {
//   transformProductData,
// };
