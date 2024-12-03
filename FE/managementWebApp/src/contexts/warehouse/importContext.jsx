import { createContext } from "react";
import {
  addnewReceipt,
  getReceiptById,
  getReceipts,
  updateReceiptStatus,
} from "../../services/warehouses/importService";
import { useState } from "react";
import { useEffect } from "react";
import { useGobal } from "..";

export const ImportContext = createContext();

export const ImportProvider = ({ children }) => {
  const [compeleted, setCompleted] = useState({});
  const [receipts, setReceipts] = useState([]);
  const [receiptsDetail, setReceiptsDetail] = useState({});
  const [queryParam, setQueryParam] = useState({
    status: 1,
    supplierId: null,
    code: null,
    createdBy: null,
    page: 1,
    limit: 10,
  });

  const buildQueryString = (query) => {
    const queryParams = Object.entries(query)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    return queryParams.join("&");
  };

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

  return (
    <ImportContext.Provider
      value={{
        receipts,
        setQueryParam,
        fetchReceiptById,
        createReceipt,
        compeleted,
      }}
    >
      {children}
    </ImportContext.Provider>
  );
};
