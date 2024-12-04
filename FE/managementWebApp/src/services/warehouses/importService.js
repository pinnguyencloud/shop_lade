import { apiWarehouse } from "../../api/apiWarehouse";

export const getReceipts = async (query) => {
  try {
    const response = await apiWarehouse.get(`${query}`);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở getReceipts: ", error.message);
    throw error;
  }
};

export const getReceiptById = async (id) => {
  try {
    const response = await apiWarehouse.get(`${id}`);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở getReceiptById: ", error.message);
    throw error;
  }
};

export const addnewReceipt = async (payload) => {
  try {
    const response = await apiWarehouse.post("", payload);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở addnewReceipt: ", error.message);
    throw error;
  }
};

export const updateReceiptStatus = async (id) => {
  try {
    const response = await apiWarehouse.put(`${id}/complete`);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở updateReceiptStatus: ", error.message);
    throw error;
  }
};

export const checkLowStock = async () => {
  try {
    const response = await apiWarehouse.get("low-stock");
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở checkLowStock: ", error.message);
    throw error;
  }
};
