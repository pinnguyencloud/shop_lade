function AddBtnIcon({ color = "#3B82F6", size = "24" }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={color} // Đổi màu nền
        />
        <path
          d="M8 12H16"
          stroke="#fff" // Đổi màu đường kẻ nếu cần
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16V8"
          stroke="#fff" // Đổi màu đường kẻ nếu cần
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  
  export default AddBtnIcon;
  