import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../contexts";
import { useState } from "react";
import Modal from "../modal";

function ProductItem({ product }) {
  const { removeProduct, notification } = useProduct();
  const { productName, images, productCode } = product;
  const { categoryId } = useParams();
  const navagate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;
  let img = "";
  if (images && images.length > 0) {
    // images.forEach((imgage) => {
    //   if (imgage.isMain) {
    //     img = `${BASE_URL}${imgage.url}`;
    //   }
    // });
    img = `${BASE_URL}${images[0]?.url}`;
  }

  const handleRemoveItem = async (id) => {
    await removeProduct(id);
  };
  return (
    <div
      className={`w-auto p-3 bg-white rounded shadow group cursor-pointer
         hover:shadow-md transition-shadow duration-200`}
      onClick={() => {
        if (!categoryId) {
          navagate(`${product.categoryId}/${product._id}`);
        } else {
          navagate(`${product._id}`);
        }
      }}
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-[250px] flex items-center justify-center">
          <img
            src={img}
            className="w-full h-auto rounded
             transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="p-4 w-full">
        <h5 className="text-lg text-center uppercase">{productName}</h5>
        <div className="flex flex-col mt-3 gap-3">
          <div className="flex justify-between text-gray-500">
            <span>Product code:</span>
            <span>{productCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Stock: {product.totalStock}</span>
            <div className="flex gap-4">
              <button>X</button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="w-[350px] py-1">
          <p className="font-semibold text-lg">
            Bạn muốn xóa thuộc tính này không ?
          </p>
          <div className="flex w-full justify-end pr-4 mt-3">
            <button className="text-primary px-2 py-1 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-all duration-150">
              Xóa
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductItem;
