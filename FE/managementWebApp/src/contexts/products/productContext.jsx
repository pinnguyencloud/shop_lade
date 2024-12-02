import { createContext, useState, useEffect } from "react";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
} from "../../services/products/productService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState({});
  const [queryParamsObj, setQueryParamsObj] = useState({
    categories: null,
    tags: null,
    colors: null,
    minPrice: null,
    maxPrice: null,
    search: null,
    sort: null,
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
    const queryParams = [];

    if (queryParamsObj.categories)
      queryParams.push(
        `categories=${encodeURIComponent(queryParamsObj.categories)}`
      );
    if (queryParamsObj.tags)
      queryParams.push(`tags=${encodeURIComponent(queryParamsObj.tags)}`);
    if (queryParamsObj.colors)
      queryParams.push(`colors=${encodeURIComponent(queryParamsObj.colors)}`);
    if (queryParamsObj.minPrice)
      queryParams.push(`minPrice=${queryParamsObj.minPrice}`);
    if (queryParamsObj.maxPrice)
      queryParams.push(`maxPrice=${queryParamsObj.maxPrice}`);
    if (queryParamsObj.search)
      queryParams.push(`search=${encodeURIComponent(queryParamsObj.search)}`);
    if (queryParamsObj.sort)
      queryParams.push(`sort=${encodeURIComponent(queryParamsObj.sort)}`);
    if (queryParamsObj.page) queryParams.push(`page=${queryParamsObj.page}`);
    if (queryParamsObj.limit) queryParams.push(`limit=${queryParamsObj.limit}`);

    const queryString = queryParams.join("&");

    fetchProducts(queryString);
  }, [
    queryParamsObj.categories,
    queryParamsObj.tags,
    queryParamsObj.colors,
    queryParamsObj.minPrice,
    queryParamsObj.maxPrice,
    queryParamsObj.search,
    queryParamsObj.sort,
    queryParamsObj.page,
    queryParamsObj.limit,
    notification,
  ]);

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
