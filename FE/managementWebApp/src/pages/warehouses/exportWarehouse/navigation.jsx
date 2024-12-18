import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavigationExport() {
  const navigate = useNavigate();
  const moduleItems = [
    {
      id: "createReceipt",
      label: "Tạo phiếu xuất kho",
      path: "create-receipt",
      color: "#D1F7C4",
      textColor: "#065F46",
    },
    {
      id: "history",
      label: "Lịch sử phiếu xuất",
      path: "export-receipt",
      color: "#E0F2FE",
      textColor: "#2563EB",
    },
    // {
    //   id: "draft",
    //   label: "Bản nháp",
    //   path: "draft-receipt",
    //   color: "#FEF3C7",
    //   textColor: "#92400E",
    // },
  ];

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className="w-full grid grid-cols-3 p-5 gap-4">
      {moduleItems.map((moduleItem) => (
        <button
          key={moduleItem.id}
          className="border-2 rounded-xl font-medium p-5 transition-all duration-200 ease-in-out
            hover:shadow-lg
            active:bg-[#D1F7C4] active:text-white active:border-[#065F46] active:scale-95"
          style={{
            backgroundColor:
              hoveredItem === moduleItem.id ? "white" : moduleItem.color,
            borderColor:
              hoveredItem === moduleItem.id
                ? moduleItem.textColor
                : moduleItem.color,
            color: moduleItem.textColor,
          }}
          onMouseEnter={() => handleMouseEnter(moduleItem.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate(moduleItem.path)}
        >
          {moduleItem.label}
        </button>
      ))}
    </div>
  );
}

export default NavigationExport;
