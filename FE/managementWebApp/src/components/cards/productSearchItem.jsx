import { useNavigate } from "react-router-dom";
import { useGobal } from "../../contexts";
import { toast } from "react-toastify";

function ProductSearchItem({ obj }) {
  const { images, productName, productCode, _id } = obj;
  const { BASE_URL } = useGobal();
  const navigate = useNavigate();

  const img = `${BASE_URL}${images[0]?.url}`;
  return (
    <div
      className="w-full bg-white rounded-lg border h-[80px] flex p-3 gap-4 shadow group cursor-pointer
     hover:border-primary transition-all active:scale-95 duration-200 ease-in-out"
      onClick={() => {
        navigate(`/warehouse/import-warehouse/import-warehouse-receipt/${_id}`);
        toast.success("Thêm sản phẩm thành công !");
      }}
    >
      <div className="w-[50px]">
        <img src={img} alt={productCode} className="w-full object-cover" />
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-lg font-medium group-hover:text-primary transition-colors duration-200 ease-in-out">
          {productName}
        </p>
        <p className="text-sm text-gray-600">{productCode}</p>
      </div>
    </div>
  );
}

export default ProductSearchItem;
