import { useEffect, useState } from "react";
import MyInput from "../../../components/form/myInput";
import { useCustomer, useExport, useProduct } from "../../../contexts";
import { postCreateReceipt } from "../../../services/warehouses/exportService";
import CompeletedIcon from "../../../assets/icons/completedIcon";
import Modal from "../../../components/modal";
import CloseCircleIcon from "../../../assets/icons/closeBtn";

function CreateExportReceipt() {
  const { listCustomer } = useCustomer();
  const { setFlag } = useExport();
  const { products, setQueryParamsObj } = useProduct();
  const [openModal, setOpenModal] = useState(false);

  const [filterCustomer, setFilterCustomer] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [selectedCustomer, setSeletedCustomer] = useState({
    customerId: null,
    receiverName: "",
    address: "",
    phoneNumber: null,
  });
  const [ortherPayload, setOrtherPayload] = useState({
    notes: "",
    deliveryUnit: "",
    expectedDeliveryDate: "",
    deliveryNotes: "",
    createdBy: "",
    exportReason: "",
  });

  const handleResetForm = () => {
    setSeletedCustomer({
      customerId: null,
      receiverName: "",
      address: "",
      phoneNumber: null,
    });
    setOrtherPayload({
      notes: "",
      deliveryUnit: "",
      expectedDeliveryDate: "",
      deliveryNotes: "",
      createdBy: "",
      exportReason: "",
    });
    setSelectedProducts({
      productCode: "",
      _id: "",
      attributes: [],
      attributeId: "",
      stock: 0,
    });
  };

  const [selectedProducts, setSelectedProducts] = useState([
    {
      productCode: "",
      _id: "",
      attributes: [],
      attributeId: "",
      stock: 0,
    },
  ]);

  const [isSuggestionsVisibleForProducts, setIsSuggestionsVisibleForProducts] =
    useState([false]);

  // Handle các thay đổi khi nhập tên khách hàng
  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setSeletedCustomer((prev) => ({
      ...prev,
      receiverName: inputName,
    }));

    if (inputName.trim() === "") {
      setFilterCustomer([]);
      setIsSuggestionsVisible(false);
      return;
    }

    const filteredCustomers = listCustomer.filter((customer) =>
      customer.name.toLowerCase().includes(inputName.toLowerCase())
    );
    setFilterCustomer(filteredCustomers);
    setIsSuggestionsVisible(filteredCustomers.length > 0);
  };

  const handleSuggestionClick = (customer) => {
    setSeletedCustomer({
      customerId: customer.id,
      receiverName: customer.name,
      phoneNumber: customer.phone,
      address: customer.address,
    });
    setIsSuggestionsVisible(false);
  };

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

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productCode: "", _id: "", attributes: [], attributeId: "" },
    ]);
    setIsSuggestionsVisibleForProducts([
      ...isSuggestionsVisibleForProducts,
      false,
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updateProduct = [...selectedProducts];
    updateProduct.splice(index, 1);
    setSelectedProducts(updateProduct);
  };

  // Hàm xử lý thay đổi productCode và gọi API với debounce
  const handleProductNameChange = (e, index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].productCode = e.target.value;
    setSelectedProducts(updatedProducts);

    const updatedSuggestionsVisibility = [...isSuggestionsVisibleForProducts];
    updatedSuggestionsVisibility[index] = true;
    setIsSuggestionsVisibleForProducts(updatedSuggestionsVisibility);

    // Gọi API nếu cần
    setQueryParamsObj((prev) => ({
      ...prev,
      productCode: e.target.value,
      limit: 0, // Điều chỉnh limit nếu cần
    }));
  };

  const handleProductSuggestionClick = (product, index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      _id: product._id,
      productCode: product.productCode,
      attributes: product.attributes,
      stock: 0,
      attributeId: "", // Reset attributeId khi chọn sản phẩm mới
    };
    setSelectedProducts(updatedProducts);

    const updatedSuggestionsVisibility = [...isSuggestionsVisibleForProducts];
    updatedSuggestionsVisibility[index] = false;
    setIsSuggestionsVisibleForProducts(updatedSuggestionsVisibility);
  };

  const handleAttributeChange = (e, index, selectedAttributeId) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].attributeId = selectedAttributeId;
    const filterAttributes = updatedProducts[index].attributes?.filter(
      (item) => item._id === selectedAttributeId
    );
    updatedProducts[index].attributes = filterAttributes;
    setSelectedProducts(updatedProducts);
  };

  const handleChangeStock = (e, index) => {
    const updateProduct = [...selectedProducts];

    updateProduct[index].stock = e.target.value;
    setSelectedProducts(updateProduct);
  };

  const handleSubmitForm = async (e) => {
    try {
      const payload = {
        ...selectedCustomer,
        ...ortherPayload,
        status: 1,
        products: selectedProducts.map((item) => ({
          _id: item._id,
          attributes: item.attributes.map((attr) => ({
            _id: attr._id,
            price: attr.price,
            stock: +item.stock,
          })),
        })),
      };
      await postCreateReceipt(payload);
      handleResetForm();
      setFlag((prev) => !prev);
      setOpenModal(true);
    } catch (error) {}
  };

  useEffect(() => {
    if (products) {
      setFilterProduct(products);
    }
  }, [products]);

  return (
    <div className="my-10">
      <h3 className="text-center text-xl font-medium mb-5">
        Tạo phiếu xuất kho
      </h3>
      <div className="flex rounded-xl border shadow bg-white">
        {/* Info */}
        <div className="w-4/6 p-5">
          <h3 className="text-center text-lg font-medium mb-5">Thông tin</h3>
          <MyInput
            name={"receiverName"}
            label={"Người nhận"}
            value={selectedCustomer.receiverName}
            onChange={handleNameChange}
          />
          {isSuggestionsVisible && filterCustomer.length > 0 && (
            <div className="relative suggestions-container">
              <div className="absolute top-[100%] left-0 bg-white border-secondGray z-10 w-full">
                {filterCustomer.map((customer) => (
                  <div
                    key={customer.id}
                    className="suggestion-item p-[10px] cursor-pointer"
                    onClick={() => handleSuggestionClick(customer)}
                  >
                    {customer.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <MyInput
            name={"address"}
            label={"Địa chỉ"}
            value={selectedCustomer.address}
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
              value={ortherPayload.exportReason}
              name={"exportReason"}
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
          <div>
            <label htmlFor="expectedDeliveryDate">Dự kiến giao hàng</label>
            <input
              id="expectedDeliveryDate"
              type="date"
              className="w-full px-3 py-2 border rounded-md mt-3  "
              onChange={handleOnChangeOther}
              value={ortherPayload.expectedDeliveryDate}
              name="expectedDeliveryDate"
            />
          </div>
        </div>

        {/* Product Form */}
        <div className="w-3/6 p-5">
          <h3 className="text-center text-lg font-medium mb-5">Sản phẩm</h3>
          <div className="flex flex-col gap-5">
            {Array.isArray(selectedProducts) &&
              selectedProducts.map((select, index) => (
                <div key={index} className="border p-5 rounded-xl relative">
                  <button
                    className="absolute top-1 right-1 opacity-30 hover:opacity-100 transition-all duration-200 active:scale-95"
                    onClick={handleRemoveProduct}
                  >
                    <CloseCircleIcon width="16" height="16" />
                  </button>
                  <MyInput
                    label={"Tìm kiếm sản phẩm"}
                    value={select.productCode}
                    onChange={(e) => handleProductNameChange(e, index)} // Xử lý khi thay đổi productCode
                  />
                  {isSuggestionsVisibleForProducts[index] &&
                    filterProduct.length > 0 && (
                      <div className="relative suggestions-container">
                        <div className="absolute top-[100%] left-0 bg-white border-secondGray z-10 w-full">
                          {filterProduct.map((product) => (
                            <div
                              key={product._id}
                              className="suggestion-item p-[10px] cursor-pointer"
                              onClick={() =>
                                handleProductSuggestionClick(product, index)
                              }
                            >
                              {product.productCode}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Chọn thuộc tính */}
                  {select.attributes.length > 0 && (
                    <div>
                      <MyInput
                        name="attributeId"
                        label="Chọn thuộc tính"
                        type="select"
                        value={select.attributeId}
                        onChange={(e) =>
                          handleAttributeChange(e, index, e.target.value)
                        }
                        options={select.attributes.map((attr) => {
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
                  )}
                  <MyInput
                    label={"Số lượng"}
                    type="number"
                    value={select.stock}
                    onChange={(e) => handleChangeStock(e, index)}
                  />
                </div>
              ))}
            <div className="flex justify-center items-center">
              <button
                className="px-5 py-2 border bg-blue-600 text-white font-medium rounded-lg hover:border-blue-600 hover:bg-white hover:text-blue-600 transition-all duration-200 active:scale-95"
                onClick={handleAddProduct}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center gap-5 my-3">
          <button
            type="submit"
            className="button py-3 px-8 rounded-xl font-medium transition-all 
            duration-200 active:scale-95 bg-[#f4b880] hover:bg-[#FFAD60] text-white"
          >
            Lưu nháp
          </button>
          <button
            onClick={handleSubmitForm}
            type="submit"
            className="button py-3 px-8 rounded-xl font-medium transition-all 
              duration-200 active:scale-95 bg-blue-500 hover:bg-[#006BFF] text-white"
          >
            Hoàn tất
          </button>
        </div>
        <a
          className="text-gray-500 opacity-50 text-sm underline transition-all 
          duration-200 cursor-pointer hover:opacity-100 hover:text-warning"
        >
          Trở lại trang chọn sản phẩm
        </a>
      </div>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        closeBtn={true}
        className={"w-2/4 h-3/5"}
      >
        <div className="px-20 py-5 border rounded-xl">
          <div className="flex flex-col gap-5 items-center justify-center w-full h-[300px]">
            <CompeletedIcon size="125" />
            <p className="text-xl font-medium text-[#007e47]">
              Tạo phiếu thành công!
            </p>
          </div>
          <div className="flex gap-5 justify-evenly">
            <button
              onClick={() => {
                setOpenModal(false);
                // navigate("/warehouse/import-warehouse/draft-receipt");
              }}
              className="px-5 py-3 border border-[#FEF3C7] bg-[#FEF3C7] text-[#92400E] font-medium hover:bg-white
            transition-all duration-300 ease-in-out active:scale-95 hover:border-[#92400E] rounded-xl"
            >
              Xem bản nháp
            </button>
            <button
              onClick={() => {
                setOpenModal(false);
                navigate("/warehouse/export-warehouse/export-receipt");
              }}
              className="px-5 py-3 border border-[#E0F2FE] bg-[#E0F2FE] text-[#2563EB] font-medium hover:bg-white
            transition-all duration-300 ease-in-out active:scale-95 hover:border-[#2563EB] hover:text-[#2563EB] rounded-xl"
            >
              Lịch sử phiếu nhập
            </button>
            <button
              className="px-5 py-3 border border-[#F29F58] bg-[#F29F58] font-medium text-white hover:bg-white
            transition-all duration-300 ease-in-out active:scale-95 hover:text-[#F29F58] rounded-xl"
            >
              Xem chi tiết và In
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CreateExportReceipt;
