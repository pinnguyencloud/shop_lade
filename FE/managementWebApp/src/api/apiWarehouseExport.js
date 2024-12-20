import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiExports = axios.create({
  baseURL: `${defaultApi}/api/exports/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiExports };
