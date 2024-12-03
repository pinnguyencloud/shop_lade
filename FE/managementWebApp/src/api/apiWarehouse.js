import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiWarehouse = axios.create({
  baseURL: `${defaultApi}/api/warehouse/imports/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiWarehouse };
