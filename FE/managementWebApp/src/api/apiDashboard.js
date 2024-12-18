import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiDashboard = axios.create({
  baseURL: `${defaultApi}/api/dashboard/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiDashboard };
