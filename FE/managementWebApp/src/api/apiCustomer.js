import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiCustomer = axios.create({
  baseURL: `${defaultApi}/api/customers/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiCustomer };
