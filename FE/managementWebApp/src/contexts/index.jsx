import { createContext, useContext } from "react";
import { ProductContext, ProductProvider } from "./products/productContext";
import { CategoriesContext, CategoriesProvider } from "./categoriesContext";

const GobalContext = createContext();

export const GobalProvider = ({ children }) => {
  function convertDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  return (
    <GobalContext.Provider value={{ convertDate }}>
      <CategoriesProvider>
        <ProductProvider>{children}</ProductProvider>
      </CategoriesProvider>
    </GobalContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
export const useCategories = () => useContext(CategoriesContext);
export const useGobal = () => useContext(GobalContext);
