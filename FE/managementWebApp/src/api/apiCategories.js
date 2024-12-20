import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL;

const apiCategories = axios.create({
  baseURL: `${defaultApi}/api/categories/`,
  headers: {
    "Content-Type": "application/json",
  },    
  
});

export { apiCategories };
