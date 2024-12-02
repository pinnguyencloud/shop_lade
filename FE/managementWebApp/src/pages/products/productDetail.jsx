import { useEffect, useState } from "react";
import Modal from "../../components/modal";
import { useGobal, useProduct } from "../../contexts";
import { useNavigate, useParams } from "react-router-dom";
import EditProductForm from "./editForm";

function ProductDetail() {
  const { fetchProductsById, singleProduct, removeProduct } = useProduct();
  const { convertDate } = useGobal();
  const { productId } = useParams();
  const [removeModal, setRemoveModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const navagate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;
  const [imgMain, setImgMain] = useState("");
  const [arrImgs, setArrImgs] = useState([]);
  const [uniqueKeys, setUniqueKeys] = useState([]);

  const handleClose = () => {
    navagate(-1);
  };

  const handleRemoveProduct = async () => {
    const response = await removeProduct(singleProduct._id);
    if (response) {
      alert("Sản phẩm đã được xóa thành công!");
      navagate(-1);
    }
  };

  useEffect(() => {
    // Chặn cuộn trang khi modal mở
    document.body.style.overflow = "hidden";

    // Khôi phục cuộn khi modal đóng
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    fetchProductsById(productId);
  }, [productId]);

  useEffect(() => {
    if (singleProduct?.images) {
      const mainImage = singleProduct.images.find((img) => img.isMain)?.url;
      setImgMain(mainImage ? `${BASE_URL}${mainImage}` : "");

      const imageArr = singleProduct.images.map(
        (img) => `${BASE_URL}${img.url}`
      );
      setArrImgs(imageArr);
    }
    if (singleProduct?.attributes) {
      // Lấy danh sách các cột duy nhất khi dữ liệu sẵn sàng
      const keys = [
        ...new Set(
          singleProduct.attributes.flatMap((attr) =>
            Object.keys(attr.attributes || {})
          )
        ),
      ];
      setUniqueKeys(keys); // Cập nhật uniqueKeys
    }
  }, [singleProduct, BASE_URL]);

  return (
    <div>
      <Modal isOpen={true} closeBtn={true} onClose={handleClose}>
        <div className="w-[70vw] h-[80vh] flex">
          <div className=" w-2/3 h-full flex flex-col items-center justify-center px-3 py-4">
            <div className="h-full w-full flex items-center justify-center">
              <img
                src={imgMain}
                className="object-cover border rounded shadow-md"
              />
            </div>
            <div className="w-full h-1/3 flex items-center">
              <div className="w-full h-2/3 p-2 border rounded flex gap-3">
                {arrImgs.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Product Thumbnail ${idx + 1}`}
                    className="w-[15%] h-full object-cover cursor-pointer border rounded hover:shadow hover:-translate-y-0.5 transition-all duration-100"
                    onClick={() => setImgMain(imgUrl)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            className="w-full h-full px-3 py-4 flex flex-col gap-5 overflow-y-auto"
            style={{ height: "calc(100% - 32px)" }}
          >
            <h4 className="text-3xl font-bold ">{singleProduct.productName}</h4>
            <p className="text-base">
              Mã sản phẩm:{" "}
              <span className="font-bold">{singleProduct.productCode}</span>
            </p>
            <p>
              Tổng số lượng sản phẩm:{" "}
              <span className="font-bold">
                {singleProduct.totalStock} sản phẩm
              </span>
            </p>
            {singleProduct?.attributes && (
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead className="border">
                  <tr>
                    {/* Render các cột từ uniqueKeys */}
                    {uniqueKeys.map((key) => (
                      <th className="border" key={key}>
                        {key}
                      </th>
                    ))}
                    <th className="border">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {singleProduct.attributes.map((attr) => (
                    <tr className="border text-center" key={attr._id}>
                      {/* Render giá trị của từng thuộc tính theo uniqueKeys */}
                      {uniqueKeys.map((key) => (
                        <td className="border" key={key}>
                          {attr.attributes[key] || "N/A"}
                        </td>
                      ))}
                      <td className="border ">{attr.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p>
              Ngày tạo:{" "}
              <span className="font-bold">
                {convertDate(singleProduct.createdAt)}
              </span>
            </p>
            <p>
              Lần cuối chỉnh sửa:{" "}
              <span className="font-bold">
                {convertDate(singleProduct.updatedAt)}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setEditModal(true)}
                className="px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-100 active:translate-y-0.5 bg-warning text-white"
              >
                Sửa sản phẩm
              </button>
              <button
                onClick={() => setRemoveModal(true)}
                className="px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-100 active:translate-y-0.5 bg-primary text-white"
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
          <Modal
            isOpen={removeModal}
            onClose={() => setRemoveModal(false)}
            title="Bạn có chắc chắn xóa sản phẩm ? "
          >
            <div className="w-[400px]">
              <p className="text-lg">
                Xóa sản phẩm "
                <span className="font-bold">{singleProduct.productName}</span>"
                ?
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={handleRemoveProduct}
                  className="px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-100 active:translate-y-0.5 bg-slate-500 text-white"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setRemoveModal(false)}
                  className="px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-100 active:translate-y-0.5 bg-primary text-white"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={editModal}
            onClose={() => setEditModal(false)}
            closeBtn={true}
          >
            <EditProductForm
              onClose={() => setEditModal(false)}
              products={singleProduct}
            />
          </Modal>
        </div>
      </Modal>
    </div>
  );
}

export default ProductDetail;
