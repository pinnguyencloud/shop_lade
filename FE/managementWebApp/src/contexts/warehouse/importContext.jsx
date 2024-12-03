import { createContext } from "react";
import {
  addnewReceipt,
  checkLowStock,
  getReceiptById,
  getReceipts,
  updateReceiptStatus,
} from "../../services/warehouses/importService";
import { useState } from "react";
import { useEffect } from "react";
import { useGobal } from "..";

export const ImportContext = createContext();

export const ImportProvider = ({ children }) => {
  const { buildQueryString } = useGobal();

  const [compeleted, setCompleted] = useState({});
  const [receipts, setReceipts] = useState([]);
  const [receiptsDetail, setReceiptsDetail] = useState({});
  const [checkStock, setCheckStock] = useState([]);
  const [queryParam, setQueryParam] = useState({
    status: 1,
    supplierId: null,
    code: null,
    createdBy: null,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const queryString = buildQueryString(queryParam);
    fetchReceipts(queryString);
  }, [queryParam]);

  const fetchReceipts = async (query) => {
    try {
      const response = await getReceipts(query);
      setReceipts(response.data);
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở fetchReceipt: ", error.message);
    }
  };

  const fetchReceiptById = async (id) => {
    try {
      const response = await getReceiptById(id);
      setReceiptsDetail(response.data);
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở fetchReceipt: ", error.message);
    }
  };

  const createReceipt = async (payload) => {
    try {
      const response = await addnewReceipt(JSON.stringify(payload));
      setCompleted(response.data);
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở createReceipt: ", error.message);
    }
  };

  const updateStatus = async (id) => {
    try {
      await updateReceiptStatus(id);
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở createReceipt: ", error.message);
    }
  };

  const checkStockWarehouse = async () => {
    try {
      const response = await checkLowStock();
      setCheckStock(response.data);
    } catch (error) {
      console.error("Đã có lỗi xảy ra ở checkStockWarehouse: ", error.message);
    }
  };

  return (
    <ImportContext.Provider
      value={{
        receipts,
        setQueryParam,
        fetchReceiptById,
        createReceipt,
        compeleted,
        checkStockWarehouse,
        updateStatus,
        checkStock,
        receiptsDetail,
      }}
    >
      {children}
    </ImportContext.Provider>
  );
};
