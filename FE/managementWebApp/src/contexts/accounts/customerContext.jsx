import { createContext, useContext, useState, useCallback } from "react";
import {
  getAllCustomers,
  postCreateCustomer,
  putChangeInfoCustomer,
  deleteCustomer,
} from "../../services/Accounts/customer/customerService";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(data?.data || []);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Lỗi khi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = useCallback(
    async (customerData) => {
      setLoading(true);
      try {
        const data = await postCreateCustomer(customerData);
        await fetchCustomers();
        setError(null);
        return data;
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi tạo:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  const updateCustomer = useCallback(
    async (id, customerData) => {
      setLoading(true);
      try {
        const data = await putChangeInfoCustomer(id, customerData);
        await fetchCustomers();
        setError(null);
        return data;
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi cập nhật:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  const removeCustomer = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const data = await deleteCustomer(id);
        await fetchCustomers();
        setError(null);
        return data;
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi xóa:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        fetchCustomers,
        createCustomer,
        updateCustomer,
        removeCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
