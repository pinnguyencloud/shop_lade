import { createContext, useEffect, useState } from "react";
import { getAllExportsReceipt } from "../../services/warehouses/exportService";

export const ExportContext = createContext();

export const ExportProvider = ({ children }) => {
  const [listReceipts, setListReceipts] = useState([]);
  const [flag, setFlag] = useState(false);
  const fetchData = async () => {
    try {
      const res = await getAllExportsReceipt();
      setListReceipts(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, [flag]);
  return (
    <ExportContext.Provider value={{ listReceipts, setFlag }}>
      {children}
    </ExportContext.Provider>
  );
};
