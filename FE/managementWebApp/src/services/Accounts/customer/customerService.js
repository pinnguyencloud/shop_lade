// customerService.js
import { apiCustomer } from "../../../api/apiCustomer";

export const getAllCustomers = async () => {
  const response = await apiCustomer.get("");
  return response.data;
};

export const postCreateCustomer = async (payload) => {
  const response = await apiCustomer.post("", payload);
  return response.data;
};

export const putChangeInfoCustomer = async (id, payload) => {
  try {
    const response = await apiCustomer.put(`${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await apiCustomer.delete(`${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa:", error);
    throw error;
  }
};

