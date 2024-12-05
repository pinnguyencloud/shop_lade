import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MyInput from "../../../components/form/myInput";
import { useImport, useSupplier } from "../../../contexts";
import ResetBtnIcon from "../../../assets/icons/resetBtn";
import Modal from "../../../components/modal";
import useResetForm from "../../../hooks/useResetForm"; // Import hook reset form
import CompeletedIcon from "../../../assets/icons/completedIcon";
import { toast } from "react-toastify";

function ImportReceipt() {
  const { productPayload, createReceipt } = useImport();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

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
      resetForm();
    }
    // console.log(payload);
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
      resetForm();
      toast.success(
        <div className="flex items-center justify-center gap-5">
          <p>Lưu thành công</p>
          <a
            className="cursor-pointer underline text-[#F29F58] font-medium"
            onClick={() =>
              navigate("/warehouse/import-warehouse/draft-receipt")
            }
          >
            Xem bản nháp
          </a>
        </div>
      );
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
                navigate("/warehouse/import-warehouse/draft-receipt");
              }}
              className="px-5 py-3 border border-[#FEF3C7] bg-[#FEF3C7] text-[#92400E] font-medium hover:bg-white
            transition-all duration-300 ease-in-out active:scale-95 hover:border-[#92400E] rounded-xl"
            >
              Xem bản nháp
            </button>
            <button
              onClick={() => {
                setOpenModal(false);
                navigate("/warehouse/import-warehouse/completed-receipt");
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
    </>
  );
}

export default ImportReceipt;
