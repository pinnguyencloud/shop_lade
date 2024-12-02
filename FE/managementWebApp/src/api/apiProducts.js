import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiProducts = axios.create({
  baseURL: `${defaultApi}/api/products/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const basicApiProduct = axios.create({
  baseURL: `${defaultApi}/api/products/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiProducts, basicApiProduct };
