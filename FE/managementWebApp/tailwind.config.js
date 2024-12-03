/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E02538",
        success: "#B3E5FC",
        warning: "#3B82F6",
        secondWarning: "#A8E6A0",
        secondGray: "#F5F5F5",
        theirdGray: "#E0E0E0",
      },
    },
  },
  plugins: [],
};
