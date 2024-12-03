import { createContext, useContext } from "react";
import { ProductContext, ProductProvider } from "./products/productContext";
import { CategoriesContext, CategoriesProvider } from "./categoriesContext";
import { ImportContext, ImportProvider } from "./warehouse/importContext";

const GobalContext = createContext();

export const GobalProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  function convertDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const buildQueryString = (query) => {
    const queryParams = Object.entries(query)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  };

  return (
    <GobalContext.Provider value={{ convertDate, buildQueryString, BASE_URL }}>
      <CategoriesProvider>
        <ProductProvider>
          <ImportProvider>{children}</ImportProvider>
        </ProductProvider>
      </CategoriesProvider>
    </GobalContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
export const useCategories = () => useContext(CategoriesContext);
export const useGobal = () => useContext(GobalContext);
export const useImport = () => useContext(ImportContext);
