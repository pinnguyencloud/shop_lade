import { apiDashboard } from "../../api/apiDashboard";

export const getOverView = async () => {
  try {
    const res = await apiDashboard.get("overview");
    return res.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra", error.message);
  }
};
export const getSales = async () => {
  try {
    const res = await apiDashboard.get("sales");
    return res.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra", error.message);
  }
};
export const getTopProducts = async () => {
  try {
    const res = await apiDashboard.get("top-products");
    return res.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra", error.message);
  }
};
export const getStockStatus = async () => {
  try {
    const res = await apiDashboard.get("stock-status");
    return res.data;
  } catch (error) {
    console.error("Đã có lỗi xảy ra", error.message);
  }
};
