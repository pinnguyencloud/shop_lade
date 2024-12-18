import { createContext, useContext } from "react";
import { ProductContext, ProductProvider } from "./products/productContext";
import { CategoriesContext, CategoriesProvider } from "./categoriesContext";
import { ImportContext, ImportProvider } from "./warehouse/importContext";
import { SupplierContext, SupplierProvider } from "./accounts/suppliersContext";
import { CustomerContext, CustomerProvider } from "./accounts/customerContext";
import { ExportContext, ExportProvider } from "./warehouse/exportContext";

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

  function convertToDateTime(isoString) {
    const date = new Date(isoString);

    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về từ 0 đến 11
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Trả về chuỗi ngày giờ theo định dạng "dd/mm/yyyy hh:mm:ss"
    return `${hours}:${minutes} | ${day}/${month}/${year} `;
  }

  function convertToDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `Ngày ${day} Tháng ${month} Năm ${year}`;
  }

  // Chuyển số tiền thành VNĐ
  function formatCurrency(amount) {
    const formattedAmount =
      amount % 1 === 0
        ? amount.toLocaleString("vi-VN")
        : amount.toFixed(2).replace(/\.00$/, "");

    return formattedAmount + " VND";
  }

  //Chuyển số tiền thành chữ
  function numberToWords(number) {
    const units = [
      "",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const tens = [
      "",
      "mười",
      "hai mươi",
      "ba mươi",
      "bốn mươi",
      "năm mươi",
      "sáu mươi",
      "bảy mươi",
      "tám mươi",
      "chín mươi",
    ];
    const thousands = ["", "nghìn", "triệu", "tỷ"];

    const convert = (num) => {
      let result = "";
      let thousandIndex = 0;

      while (num > 0) {
        const part = num % 1000;
        if (part !== 0) {
          result =
            convertThreeDigits(part) +
            (thousands[thousandIndex] ? " " + thousands[thousandIndex] : "") +
            " " +
            result;
        }
        num = Math.floor(num / 1000);
        thousandIndex++;
      }

      return result.trim();
    };

    const convertThreeDigits = (num) => {
      let result = "";
      const hundreds = Math.floor(num / 100);
      const tensAndUnits = num % 100;

      if (hundreds > 0) {
        result += units[hundreds] + " trăm";
      }

      if (tensAndUnits > 0) {
        if (tensAndUnits < 10) {
          result += " lẻ " + units[tensAndUnits];
        } else {
          const tenPart = Math.floor(tensAndUnits / 10);
          const unitPart = tensAndUnits % 10;

          if (tenPart > 0) {
            result += tens[tenPart];
          }

          if (unitPart > 0) {
            result += " " + units[unitPart];
          }
        }
      }

      return result;
    };

    return convert(number).trim() + " đồng";
  }

  return (
    <GobalContext.Provider
      value={{
        convertDate,
        buildQueryString,
        BASE_URL,
        convertToDateTime,
        convertToDate,
        numberToWords,
        formatCurrency,
      }}
    >
      <CategoriesProvider>
        <ProductProvider>
          <ImportProvider>
            <CustomerProvider>
              <ExportProvider>
                <SupplierProvider>{children}</SupplierProvider>
              </ExportProvider>
            </CustomerProvider>
          </ImportProvider>
        </ProductProvider>
      </CategoriesProvider>
    </GobalContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
export const useCategories = () => useContext(CategoriesContext);
export const useGobal = () => useContext(GobalContext);
export const useImport = () => useContext(ImportContext);
export const useSupplier = () => useContext(SupplierContext);
export const useCustomer = () => useContext(CustomerContext);
export const useExport = () => useContext(ExportContext);
