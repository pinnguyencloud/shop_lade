import { createContext, useEffect, useState } from "react";
import {
  addNewSuppliers,
  getAllSuppliers,
} from "../../services/Accounts/suppliers/suppliersServices";

export const SupplierContext = createContext();

export const SupplierProvider = ({ chidren }) => {
  const [suppliers, setSuppliers] = useState([]);

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliers();
      setSuppliers(response.data);
    } catch (error) {}
  };

  const createSuppliers = async (payload) => {
    try {
      const response = await addNewSuppliers(payload);
    } catch (error) {}
  };

  return (
    <SupplierContext.Provider value={{ suppliers, createSuppliers }}>
      {chidren}
    </SupplierContext.Provider>
  );
};
