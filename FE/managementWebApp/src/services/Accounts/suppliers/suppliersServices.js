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
