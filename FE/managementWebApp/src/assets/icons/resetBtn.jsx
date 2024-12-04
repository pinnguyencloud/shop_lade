function ResetBtnIcon({ color = "#3B82F6", size = "24" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.01001 14.51C8.19001 14.81 8.41 15.09 8.66 15.34C10.5 17.18 13.49 17.18 15.34 15.34C16.09 14.59 16.52 13.64 16.66 12.67"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.34009 11.33C7.48009 10.35 7.9101 9.40997 8.6601 8.65997C10.5001 6.81997 13.4901 6.81997 15.3401 8.65997C15.6001 8.91997 15.8101 9.19999 15.9901 9.48999"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.82007 17.18V14.51H10.4901"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.18 6.82001V9.48999H13.51"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ResetBtnIcon;
