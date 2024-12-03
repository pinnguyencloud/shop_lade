import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiSuppliers = axios.create({
  baseURL: `${defaultApi}/api/suppliers/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiSuppliers };
