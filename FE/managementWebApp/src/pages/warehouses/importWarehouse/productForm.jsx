import { useState, useEffect } from "react";
import MyInput from "../../../components/form/myInput";
import { useImport, useProduct } from "../../../contexts";
import { useParams } from "react-router-dom";
import CloseCircleIcon from "../../../assets/icons/closeBtn";
import AddBtnIcon from "../../../assets/icons/addBtn";

function ProductForm() {
  const { id } = useParams();
  const { fetchProductsById, singleProduct } = useProduct();
  const { setProductPayload } = useImport();
  const [formData, setFormData] = useState({
    selectedAttributes: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      await fetchProductsById(id);
      setProductPayload();
    };
    fetchProduct();
  }, [id]);

  // Cập nhật productPayload mỗi khi selectedAttributes thay đổi
  useEffect(() => {
    if (formData.selectedAttributes.length > 0) {
      setProductPayload({
        _id: singleProduct._id,
        attributes: formData.selectedAttributes.map((attr) => ({
          _id: attr.attributeId,
          stock: +attr.quantity,
          price: +attr.price,
        })),
      });
    }
  }, [formData.selectedAttributes, singleProduct._id, setProductPayload]);

  const handleAttributeChange = (e, index, attributeId) => {
    const { name, value } = e.target;
    const updatedAttributes = [...formData.selectedAttributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [name]: value,
      attributeId,
    };

    // Cập nhật formData mà không gọi setProductPayload trực tiếp
    setFormData((prev) => ({ ...prev, selectedAttributes: updatedAttributes }));
  };

  const handleAddAttribute = () => {
    setFormData((prev) => {
      const newAttributes = [
        ...prev.selectedAttributes,
        { quantity: 0, price: 0, attributeId: "" },
      ];

      return { ...prev, selectedAttributes: newAttributes };
    });
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = formData.selectedAttributes.filter(
      (attribute, idx) => idx !== index
    );
    setFormData((prev) => ({ ...prev, selectedAttributes: updatedAttributes }));
  };

  if (!singleProduct) return <p>Loading...</p>;

  return (
    <div className="w-[40%] flex flex-col gap-3">
      {/* Tên sản phẩm (không sửa được) */}
      <div className="relative w-full">
        <MyInput type="text" value={singleProduct.productName} disabled />
      </div>

      {/* Lặp qua các thuộc tính và render input tương ứng */}
      {formData.selectedAttributes.map((attribute, index) => (
        <div key={index} className="bg-[#F4F6FF] relative p-4 pt-8 rounded-md">
          {/* Select thuộc tính */}
          <div>
            <MyInput
              name="attributeId"
              label="Chọn thuộc tính"
              type="select"
              value={attribute.attributeId}
              onChange={(e) => handleAttributeChange(e, index, e.target.value)}
              options={singleProduct?.attributes?.map((attr) => {
                const attributes = attr.attributes;
                const label = Object.entries(attributes)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" / ");
                return {
                  label, 
                  value: attr._id,
                };
              })}
            />
          </div>

          {/* Số lượng */}
          <div className="flex gap-5">
            <MyInput
              name="quantity"
              label="Số lượng"
              type="number"
              value={attribute.quantity}
              id={`quantity-${attribute.attributeId}`}
              onChange={(e) =>
                handleAttributeChange(e, index, attribute.attributeId)
              }
            />

            {/* Giá nhập */}
            <MyInput
              name="price"
              label="Giá nhập"
              id={`price-${attribute.attributeId}`}
              type="number"
              value={attribute.price}
              onChange={(e) =>
                handleAttributeChange(e, index, attribute.attributeId)
              }
            />
          </div>

          <button
            onClick={() => {
              handleRemoveAttribute(index);
            }}
            className="absolute top-2 right-3"
          >
            <CloseCircleIcon color="#B7B7B7" width="16" height="16" />
          </button>
        </div>
      ))}

      {/* Nút thêm */}
      <div className="w-full flex items-center justify-center">
        <button
          type="button"
          onClick={handleAddAttribute}
          className="opacity-80 active:scale-95 hover:opacity-100 transition-all duration-300 ease-in-out"
        >
          <AddBtnIcon color="#22c55e" size="30" />
        </button>
      </div>
    </div>
  );
}

export default ProductForm;
