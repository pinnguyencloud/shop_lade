import { createContext, useEffect, useState } from "react";
import { getAllCustomers } from "../../services/Accounts/customer/customerService";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [listCustomer, setListCustomer] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    fetchAllCustomer();
  }, [flag]);

  const fetchAllCustomer = async () => {
    try {
      const res = await getAllCustomers();
      setListCustomer(res.data);
    } catch (error) {
      console.error("Đã có lỗi xảy ra");
    }
  };
  return (
    <CustomerContext.Provider value={{ listCustomer, setFlag }}>
      {children}
    </CustomerContext.Provider>
  );
};
