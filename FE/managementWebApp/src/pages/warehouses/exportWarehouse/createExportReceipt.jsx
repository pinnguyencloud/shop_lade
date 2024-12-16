import { useState } from "react";
import MyInput from "../../../components/form/myInput";

function CreateExportReceipt() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedCustomer, setSeletedCustomer] = useState({
    customerId: null,
    receiverName: "",
    receiverAddress: "",
    phoneNumber: null,
  });
  const [ortherPayload, setOrtherPayload] = useState({
    notes: "",
    deliveryUnit: "",
    expectedDeliveryDate: "",
    deliveryNotes: "",
    createdBy: "",
    reasonExport: "",
  });

  const handleOnChangeCustomer = (e) => {
    setSeletedCustomer((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnChangeOther = (e) => {
    setOrtherPayload((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectProduct = (index, productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      _id: selectedProduct._id,
      attributes: selectedProduct.attributes.map((attr) => ({
        _id: attr._id,
        stock: 0, // Người dùng nhập vào giá trị stock
        price: attr.price, // Lấy giá trị price từ cơ sở dữ liệu
      })),
    };
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = () => {
    const payload = {
      products: selectedProducts.map((product) => ({
        _id: product._id,
        attributes: product.attributes.map((attribute) => ({
          _id: attribute._id,
          stock: attribute.stock, // Số lượng nhập vào
          price: attribute.price, // Giá lấy từ cơ sở dữ liệu
        })),
      })),
    };

    console.log("Payload:", payload);

    // Gửi dữ liệu tới API
    // axios.post('/api/submit', payload);
  };
  const handleStockChange = (index, stock) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].attributes[0].stock = stock; // Cập nhật stock
    setSelectedProducts(updatedProducts);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { _id: "", name: "", attributes: [] },
    ]);
  };

  // Thêm thuộc tính vào sản phẩm
  const handleAddAttribute = (productIndex) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[productIndex];

    // Thêm thuộc tính mới (có thể chọn lại thuộc tính và nhập stock)
    product.attributes.push({ _id: "", type: "", stock: 0, price: 0 });

    setSelectedProducts(updatedProducts);
  };

  return (
    <>
      <h3 className="text-center text-xl font-medium mb-5">
        Tạo phiếu xuất kho
      </h3>
      <div className="flex rounded-xl border shadow bg-white">
        {/* Info */}
        <div className=" w-4/6 p-5 ">
          <h3 className="text-center text-lg font-medium mb-5">Thông tin</h3>
          <MyInput
            name={"receiverName"}
            label={"Người nhận"}
            value={selectedCustomer.receiverName}
            onChange={handleOnChangeCustomer}
          />
          <MyInput
            name={"receiverAddress"}
            label={"Địa chỉ"}
            value={selectedCustomer.receiverAddress}
            onChange={handleOnChangeCustomer}
          />
          <MyInput
            name={"phoneNumber"}
            label={"Số điện thoại"}
            type="number"
            value={selectedCustomer.phoneNumber}
            onChange={handleOnChangeCustomer}
          />
          <MyInput
            label={"Người tạo phiếu"}
            onChange={handleOnChangeOther}
            value={ortherPayload.createdBy}
            name={"createdBy"}
          />
          <div className="flex gap-5">
            <MyInput
              label={"Lý do xuất kho"}
              onChange={handleOnChangeOther}
              value={ortherPayload.reasonExport}
              name={"reasonExport"}
            />
            <MyInput
              label={"Ghi chú xuất kho"}
              onChange={handleOnChangeOther}
              value={ortherPayload.notes}
              name={"notes"}
            />
          </div>
          <div className="flex gap-5">
            <MyInput
              label={"Đơn vị giao hàng"}
              onChange={handleOnChangeOther}
              value={ortherPayload.deliveryUnit}
              name={"deliveryUnit"}
            />
            <MyInput
              label={"Ghi chú cho bên giao hàng"}
              onChange={handleOnChangeOther}
              value={ortherPayload.deliveryNotes}
              name={"deliveryNotes"}
            />
          </div>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            onChange={handleOnChangeOther}
            value={ortherPayload.expectedDeliveryDate}
            name="expectedDeliveryDate"
          />
        </div>
        {/* products */}
        <div className=" w-3/6 p-5">
          <div>
            <h3>Product Form</h3>

            {/* Nút "Thêm sản phẩm" */}
            <button onClick={handleAddProduct}>Thêm sản phẩm</button>

            {/* Danh sách các sản phẩm đã chọn */}
            {selectedProducts.map((product, productIndex) => (
              <div key={productIndex} className="product-selection">
                <h4>Chọn sản phẩm {product.name}</h4>

                {/* Chọn sản phẩm */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Tìm kiếm sản phẩm"
                />
                {isSearchActive && (
                  <div>
                    {filteredProducts.length > 0 && searchTerm && (
                      <ul>
                        {filteredProducts.map((product) => (
                          <li
                            key={product._id}
                            onClick={() =>
                              handleSelectProduct(productIndex, product._id)
                            }
                          >
                            {product.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Hiển thị thuộc tính của sản phẩm */}
                {product._id && (
                  <div>
                    <h5>Thuộc tính</h5>
                    {product.attributes.map((attribute, attributeIndex) => (
                      <div key={attributeIndex}>
                        <label>Loại thuộc tính</label>
                        <select
                          value={attribute.type}
                          onChange={(e) => {
                            const updatedProducts = [...selectedProducts];
                            updatedProducts[productIndex].attributes[
                              attributeIndex
                            ].type = e.target.value;
                            setSelectedProducts(updatedProducts);
                          }}
                        >
                          <option value="">Chọn thuộc tính</option>
                          <option value="color">Màu sắc</option>
                          <option value="size">Kích thước</option>
                          {/* Các loại thuộc tính khác nếu có */}
                        </select>
                        <label>Stock</label>
                        <input
                          type="number"
                          value={attribute.stock}
                          onChange={(e) =>
                            handleStockChange(
                              productIndex,
                              attributeIndex,
                              e.target.value
                            )
                          }
                          placeholder="Nhập số lượng"
                        />
                        <div>Price: {attribute.price}</div>{" "}
                        {/* Hiển thị giá từ API */}
                      </div>
                    ))}

                    {/* Nút thêm thuộc tính */}
                    <button onClick={() => handleAddAttribute(productIndex)}>
                      Thêm thuộc tính
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Nút Gửi */}
            <button onClick={handleSubmit}>Gửi</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateExportReceipt;
