import { createContext, useEffect, useState } from "react";
import { getAllCategory } from "../services/products/categoryService";

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategores] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();

      setCategores(response.data);
    } catch (error) {
      console.error(
        "Đã có lỗi xảy ra trong quá trình getAllCategory",
        error.message
      );
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};
