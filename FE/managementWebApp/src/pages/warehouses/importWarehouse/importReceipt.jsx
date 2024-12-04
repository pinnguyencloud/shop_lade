import { useState } from "react";
import { Outlet } from "react-router-dom";
import MyInput from "../../../components/form/myInput";
import { useImport, useSupplier } from "../../../contexts";
import ResetBtnIcon from "../../../assets/icons/resetBtn";
import Modal from "../../../components/modal";
import useResetForm from "../../../hooks/useResetForm"; // Import hook reset form

function ImportReceipt() {
  const { productPayload, createReceipt } = useImport();
  const [openModal, setOpenModal] = useState(false);

  // Default form data
  const defaultFormData = {
    supplierId: null,
    deliveryPerson: null,
    phoneNumber: null,
    createdBy: null,
    notes: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const { suppliers } = useSupplier();

  // Khởi tạo hàm reset form từ custom hook
  const resetForm = useResetForm(setFormData, defaultFormData);

  const handleSubmitCompleted = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      products: [{ ...productPayload }],
      status: 1,
    };

    const compeleted = await createReceipt(payload);
    if (compeleted) {
      setOpenModal(true);
    }
  };

  const handleSubmitDraft = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      products: [{ ...productPayload }],
      status: 0,
    };

    const compeleted = await createReceipt(payload);
    if (compeleted) {
      setOpenModal(true);
    }
  };

  const supplierOptions = suppliers.map((supplier) => ({
    label: supplier.supplier_name,
    value: supplier.id,
  }));

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <form className="w-full bg-white rounded-xl shadow px-[130px] py-14">
        <h2 className="text-center text-4xl font-bold uppercase text-primary pb-8 border-b border-gray-400 border-opacity-50">
          Tạo phiếu nhập kho
        </h2>
        <div className="w-full flex justify-end pr-6 my-3">
          <button type="button" onClick={resetForm} className="right-52">
            <ResetBtnIcon />
          </button>
        </div>
        <div className="flex gap-5">
          {/* left pane */}
          <div className="w-[55%] flex flex-col items-center">
            <div className="w-full relative">
              <MyInput
                name={"supplierId"}
                label={"Chọn nhà cung cấp"}
                type="select"
                value={formData.supplierId}
                onChange={handleChanged}
                options={supplierOptions || []}
              />
            </div>
            <div className="w-full mt-5">
              <MyInput
                name={"createdBy"}
                label={"Người tạo phiếu"}
                type="text"
                value={formData.createdBy}
                onChange={handleChanged}
              />
            </div>
            <div className="w-full">
              <MyInput
                name={"deliveryPerson"}
                label={"Người giao hàng"}
                type="text"
                value={formData.deliveryPerson}
                onChange={handleChanged}
              />
            </div>
            <div className="w-full">
              <MyInput
                name={"phoneNumber"}
                label={"SDT người giao hàng"}
                type="number"
                value={formData.phoneNumber}
                onChange={handleChanged}
              />
            </div>
            <div className="w-full">
              <MyInput
                name={"notes"}
                label={"Ghi chú"}
                type="textarea"
                value={formData.notes}
                onChange={handleChanged}
              />
            </div>
          </div>
          {/* right pane */}
          <Outlet />
        </div>
        <div>
          <div className="flex items-center justify-center gap-5 my-3">
            <button
              type="submit"
              onClick={handleSubmitDraft}
              className="button py-3 px-8 rounded-xl font-medium transition-all 
            duration-200 active:scale-95 bg-[#f4b880] hover:bg-[#FFAD60] text-white"
            >
              Lưu nháp
            </button>
            <button
              type="submit"
              onClick={handleSubmitCompleted}
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
      </form>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        closeBtn={true}
      >
        Ok rồi nè
      </Modal>
    </>
  );
}

export default ImportReceipt;
