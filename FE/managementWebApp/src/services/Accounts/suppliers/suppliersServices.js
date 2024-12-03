import { apiSuppliers } from "../../../api/apiSuppliers";

export const getAllSuppliers = async () => {
  try {
    const response = await apiSuppliers.get("");
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở getAllSuppliers:", error.message);
  }
};

export const addNewSuppliers = async (payload) => {
  try {
    const response = await apiSuppliers.post("", JSON.stringify(payload));
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở addNewSuppliers:", error.message);
  }
};

export const getSuppliersID = async (id) => {
  try {
    const response = await apiSuppliers.get(id);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở getSuppliersID:", error.message);
  }
};

export const updateSuppliersID = async (id, payload) => {
  try {
    const response = await apiSuppliers.put(id, JSON.stringify(payload));
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở updateSuppliersID:", error.message);
  }
};

export const deteleSuppliersID = async (id) => {
  try {
    const response = await apiSuppliers.delete(id);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra ở deteleSuppliersID:", error.message);
  }
};