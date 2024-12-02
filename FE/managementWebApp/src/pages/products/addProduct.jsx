import { useEffect, useState } from "react";
import DynamicForm from "../../components/form/DynamicForm";
import categoryConfig from "./configs/categoryConfig";
import MyInput from "../../components/form/myInput";
import { useProduct } from "../../contexts";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [selectedId, setSelectedId] = useState(0);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    description: "",
  });
  const [dynamicForm, setDynamicForm] = useState({ stock: 0, price: 0 });
  const { createProduct } = useProduct();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Vui lòng chọn nhiều hơn 1 ảnh");
      return;
    }

    const { subCategoryId, ...newDynamicForm } = dynamicForm;
    const payload = {
      ...formData,
      categoryId: subCategoryId ? subCategoryId : selectedId,
      attributes: {
        ...newDynamicForm,
      },
    };
    const formDataToSend = new FormData();
    formDataToSend.append("productData", JSON.stringify(payload));

    Array.from(images).forEach((image, index) => {
      formDataToSend.append(`images`, image);
    });

    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await createProduct(formDataToSend);
    if (response) {
      alert("Thêm sản phẩm thành công");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productCode: "",
      description: "",
    });
    setDynamicForm({ stock: 0, price: 0 });
    setImages([]);
    setSelectedId(0);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  useEffect(() => {
    setDynamicForm({});
  }, [selectedId]);

  const selectedCategory = categoryConfig.find((cat) => cat.id === selectedId);

  return (
    <div className="py-10">
      <h3 className="text-[28px] font-bold">Add Product</h3>
      <p className="italic text-base">Thêm sản phẩm</p>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded px-4 py-2 w-full mt-5 flex gap-3"
      >
        {/* Left Panel */}
        <div className="w-full border-r border-r-gray-200 pr-5">
          <h3 className="text-2xl font-semibold ml-2 my-4">
            Thông tin sản phẩm
          </h3>
          <MyInput
            label="Tên sản phẩm"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            type="text"
          />
          <MyInput
            label="Mã sản phẩm"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            type="text"
          />
          <MyInput
            label="Mô tả sản phẩm"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
          />
          <div className="mb-5 flex justify-between">
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(e) => setImages(e.target.files)}
            />
            <button
              className="py-1 px-3 border bg-warning text-white rounded hover:opacity-80
             transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={!formData.productName || !formData.productCode}
            >
              Xác nhận
            </button>
          </div>
          <a
            onClick={() => navigate(-1)}
            className="text-sm underline cursor-pointer text-warning hover:text-primary transition-color duration-200"
          >
            Trở lại trang sản phẩm
          </a>
        </div>

        {/* Right Panel */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold ml-2 my-4">
            Thuộc tính sản phẩm
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Chọn danh mục
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              <option value={0}>-- Chọn danh mục --</option>
              {categoryConfig.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory ? (
            <DynamicForm
              categoryId={selectedId}
              formData={dynamicForm}
              setFormData={setDynamicForm}
              config={categoryConfig}
            />
          ) : (
            <p className="text-gray-500">
              Vui lòng chọn danh mục để hiển thị thông tin.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
