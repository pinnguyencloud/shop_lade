import React, { useEffect, useState } from "react";
import { useProduct } from "../../contexts";
import Modal from "../../components/modal";

const EditProductForm = ({ products, onClose }) => {
  const { updateProduct, removeProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [description, setDescription] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [modalAttr, setModalAttr] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState(null);

  useEffect(() => {
    if (products) {
      setProduct(products);
      setProductName(products.productName || "");
      setProductCode(products.productCode || "");
      setDescription(products.description || "");
      setTotalStock(products.totalStock || 0);
      setAttributes(products.attributes || []);
    }
  }, [products]);

  const handleAttributeChange = (index, key, value) => {
    const updatedAttributes = [...attributes];
    if (key === "attributes") {
      updatedAttributes[index][key] = {
        ...updatedAttributes[index][key],
        ...value,
      };
    } else {
      updatedAttributes[index][key] = value;
    }
    setAttributes(updatedAttributes);
  };

  const handleRemoveAttribute = async (index, id) => {
    const response = await removeProduct(`${product._id}?attributeId=${id}`);
    if (response) {
      alert("Xóa thuộc tính thành công");
      const updatedAttributes = attributes.filter((_, i) => i !== index);
      setAttributes(updatedAttributes);
      setModalAttr(false);
    }
  };

  const handleSaveAttribute = async (index) => {
    const updatedAttribute = attributes[index];
    const payload = {
      stock: updatedAttribute.stock,
      price: updatedAttribute.price,
      attributes: updatedAttribute.attributes,
    };
    const response = await updateProduct(
      `${product._id}?attributeId=${updatedAttribute._id}`,
      payload
    );
    if (response) {
      alert("Cập nhật thành công");
    }
  };

  const handleSaveMainFields = async () => {
    const payload = {
      productName,
      productCode,
      description,
      totalStock,
    };

    const response = await updateProduct(product._id, payload);
    if (response) {
      alert("Cập nhật thành công");
    }
  };

  return (
    <div className="p-4 max-w-4xl h-[90vh] mx-auto bg-white shadow-md rounded-lg overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Chỉnh sửa sản phẩm</h2>

      {/* Main Fields */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Tên sản phẩm</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mã sản phẩm</label>
        <input
          type="text"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleSaveMainFields}
          className="w-full px-4 py-2 bg-green-500 text-white rounded"
        >
          Lưu thông tin
        </button>
      </div>

      {/* Attributes */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Danh sách thuộc tính</label>
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="border rounded mb-2 p-3 bg-gray-50 shadow-sm"
          >
            <h3 className="text-md font-semibold mb-2">
              Thuộc tính #{index + 1}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-2">
              

              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="number"
                  value={attr.price}
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "price",
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-2">
              <h4 className="font-medium">Thuộc tính khác</h4>
              {Object.entries(attr.attributes || {}).map(([key, value]) => (
                <div key={key} className="flex items-center mb-2">
                  <label className="w-1/3 text-sm font-medium">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleAttributeChange(index, "attributes", {
                        [key]: e.target.value,
                      })
                    }
                    className="w-2/3 px-3 py-2 border rounded focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSaveAttribute(index)}
              className="px-3 py-2 bg-blue-500 text-white rounded mb-2 mr-5"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => {
                setModalAttr(true);
                setSelectedAttr({ index, id: attr._id });
              }}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Xóa thuộc tính
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-green-500 text-white rounded mt-4"
      >
        Hoàn tất
      </button>
      <Modal isOpen={modalAttr} onClose={() => setModalAttr(false)}>
        <div className="w-[350px] py-1">
          <p className="font-semibold text-lg">
            Bạn muốn xóa thuộc tính này không ?
          </p>
          <div className="flex w-full justify-end pr-4 mt-3">
            <button
              onClick={() => {
                if (selectedAttr) {
                  handleRemoveAttribute(selectedAttr.index, selectedAttr.id);
                }
              }}
              className="text-primary px-2 py-1 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-all duration-150"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditProductForm;
