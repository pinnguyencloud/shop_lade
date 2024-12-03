function ProductSearchItem({ obj }) {
  const { img, productName, productCode } = obj;
  return (
    <div className="w-full bg-white rounded-lg h-[80px] flex p-3 gap-4">
      <div className="w-[50px]">
        <img src={img} alt={productCode} className="w-full object-cover" />
      </div>
      <div className="flex flex-col justify-between">
        <p>{productName}</p>
        <p>{productCode}</p>
      </div>
    </div>
  );
}

export default ProductSearchItem;
