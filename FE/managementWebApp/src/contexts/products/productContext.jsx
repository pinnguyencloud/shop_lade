import { createContext, useState, useEffect, useRef } from "react";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
} from "../../services/products/productService";
import { useGobal } from "..";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { buildQueryString } = useGobal();
  const [notification, setNotification] = useState("");
  const [products, setProducts] = useState([]);
  const currentQueryString = useRef();
  const [singleProduct, setSingleProduct] = useState({});
  const [queryParamsObj, setQueryParamsObj] = useState({
    categories: null,
    tags: null,
    colors: null,
    minPrice: null,
    maxPrice: null,
    search: null,
    sort: null,
    productCode: null,
    sortStock: null,
    page: 1,
    limit: 9,
  });

  const fetchProducts = async (queryParams) => {
    try {
      const response = await getProducts(queryParams);
      setProducts(response.data);
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở fetchData: ", error.message);
    }
  };

  const fetchProductsById = async (id) => {
    try {
      const response = await getProductById(`${id}`);
      setSingleProduct(response.data);
      return true;
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở fetchProductsById: ", error.message);
    }
  };

  useEffect(() => {
    // Kiểm tra nếu queryParamsObj thay đổi thực sự
    const queryString = buildQueryString(queryParamsObj);
    if (queryString !== currentQueryString.current) {
      currentQueryString.current = queryString;
      fetchProducts(queryString);
    }
  }, [queryParamsObj]);

  const createProduct = async (payload) => {
    try {
      const response = await addNewProduct(payload);
      setNotification(response);
      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở createProduct: ", error.message);
    }
  };

  const updateProduct = async (id, payload) => {
    try {
      const response = await editProduct(id, payload);
      setNotification(response);
      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở uppdateProduct: ", error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      setNotification(response);
      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở removeProduct: ", error.message);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        singleProduct,
        notification,
        setQueryParamsObj,
        createProduct,
        updateProduct,
        removeProduct,
        fetchProductsById,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
