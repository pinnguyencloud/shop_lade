import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // Đảm bảo rằng process.env được định nghĩa
  },
  resolve: {
    alias: {
      process: "process/browser", // Polyfill process cho môi trường trình duyệt
    },
  },
});
