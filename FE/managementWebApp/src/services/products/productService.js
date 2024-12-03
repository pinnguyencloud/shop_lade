import { apiProducts, basicApiProduct } from "../../api/apiProducts";

export const getProducts = async (queryParams) => {
  try {
    const response = await basicApiProduct.get(`filter${queryParams}`);
    return response.data;
  } catch (error) {
    console.error(
      "Đã có lỗi xảy ra trong quá trình getProducts: ",
      error.response || error.message
    );
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await basicApiProduct.get(`${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Đã có lỗi xảy ra trong quá trình getProducts: ",
      error.response || error.message
    );
    throw error;
  }
};

export const addNewProduct = async (payload) => {
  try {
    const response = await apiProducts.post("", payload);
    return response.data;
  } catch (error) {
    console.error(
      "Đã có lỗi xảy ra trong quá trình thêm mới sản phẩm: ",
      error.response || error.message
    );
    throw error;
  }
};

export const editProduct = async (id, payload) => {
  try {
    const response = await basicApiProduct.put(`${id}`, JSON.stringify(payload));
    return response.data;
  } catch (error) {
    console.error(
      "Đã có lỗi xảy ra trong quá trình sửa sản phẩm: ",
      error.response || error.message
    );
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await basicApiProduct.delete(`${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Đã có lỗi xảy ra trong quá trình sửa sản phẩm: ",
      error.response || error.message
    );
    throw error;
  }
};
