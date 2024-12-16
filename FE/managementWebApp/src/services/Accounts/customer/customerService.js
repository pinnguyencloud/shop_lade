import { apiCustomer } from "../../../api/apiCustomer";
import { toast } from "react-toastify";

export const getAllCustomers = async () => {
  try {
    const res = await apiCustomer.get();
    return res.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở get All: ", error.message);
  }
};

export const getCustomerById = async (id) => {
  try {
    const res = await apiCustomer.get(id);
    return res.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở getById", error.message);
  }
};

export const postCreateCustomer = async (payload) => {
  try {
    const res = await apiCustomer.post("", JSON.stringify(payload));
    toast.success("Tạo khách hàng mới thành công");
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};

export const putChangeInfoCustomer = async (id, payload) => {
  try {
    const res = await apiCustomer.put(`${id}`, JSON.stringify(payload));
    toast.success("Thay đổi thông tin khách hàng thành công");
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const res = await apiCustomer.delete(id);
    toast.success("Xóa tài khoản khách hàng thành công");
    return res.data;
  } catch (error) {
    toast.error(error.data.message);
  }
};
