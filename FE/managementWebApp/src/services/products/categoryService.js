import { apiCategories } from "../../api/apiCategories";

export const getAllCategory = async () => {
  try {
    const response = await apiCategories.get("");
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi trong quá trình getAllCategory", error.message);
  }
};

export const getCategorieById = async (id) => {
  try {
    const response = await apiCategories.get(`${id}`);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi trong quá trình getCategorieById", error.message);
  }
};

export const getSubCategory = async (id) => {
  try {
    const response = await apiCategories.get(`${id}/subcategories`);
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi trong quá trình getSubCategory", error.message);
  }
};

export const addCategorie = async (payload) => {
  try {
    const response = await apiCategories.post("", JSON.stringify(payload));
    return response.data;
  } catch (error) {
    console.error("Đã có lỗi trong quá trình addCategorie", error.message);
  }
};
