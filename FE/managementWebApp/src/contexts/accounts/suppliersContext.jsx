import { createContext, useEffect, useState } from "react";
import {
  addNewSuppliers,
  deteleSuppliersID,
  getAllSuppliers,
  getSuppliersID,
  updateSuppliersID,
} from "../../services/Accounts/suppliers/suppliersServices";

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách suppliers:", error);
    }
  };

  const fetchSupplierById = async (id) => {
    try {
      const response = await getSuppliersID(`${id}`);
      setSupplierDetails(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách supplier by id:", error);
    }
  };

  const createSuppliers = async (payload) => {
    try {
      await addNewSuppliers(payload);
      fetchSuppliers();
    } catch (error) {
      console.error("Lỗi khi tạo supplier:", error);
    }
  };

  const upSuppliersId = async (id, payload) => {
    try {
      await updateSuppliersID(id, payload);
      fetchSuppliers();
    } catch (error) {
      console.error("Lỗi khi cập nhật supplier:", error);
    }
  };

  const delSuppliersId = async (id) => {
    try {
      await deteleSuppliersID(id);
      fetchSuppliers();
    } catch (error) {
      console.error("Lỗi khi xóa supplier:", error);
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        createSuppliers,
        upSuppliersId,
        delSuppliersId,
        fetchSupplierById,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};
