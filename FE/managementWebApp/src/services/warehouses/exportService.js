import { toast } from "react-toastify";
import { apiExports } from "../../api/apiWarehouseExport";

export const postCreateReceipt = async (payload) => {
  try {
    const res = await apiExports.post("", JSON.stringify(payload));
    toast.success("Tạo phiếu nhập kho thành công");
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};

export const getAllExportsReceipt = async () => {
  try {
    const res = await apiExports.get();
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};

export const getExportDetail = async (id) => {
  try {
    const res = await apiExports.get(id);
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};

export const putUpdateStatus = async (id) => {
  try {
    const res = await apiExports.put(`${id}/status`);
    toast.success("Thay đổi trạng thái phiếu thành công");
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};

export const putCancelReceipt = async (id) => {
  try {
    const res = await apiExports.put(`${id}/cancel`);
    toast.success("Hủy bỏ phiếu thành công");
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};
