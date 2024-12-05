import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  const moduleItems = [
    {
      id: "importWarehouse",
      label: "Nhập kho",
      path: "import-warehouse",
      color: "#3B82F6",
    },
    { id: "exportWarehouse", label: "Xuất kho", path: "", color: "#EF4444" },
    { id: "inventory", label: "QL Tồn kho", path: "", color: "#10B981" },
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
          className="border-2 rounded-xl font-medium p-5 transition-all hover:shadow duration-200 ease-in-out hover:text-primary"
          style={{
            backgroundColor:
              hoveredItem === moduleItem.id ? "white" : moduleItem.color,
            borderColor:
              hoveredItem === moduleItem.id ? moduleItem.color : "white",
            color: hoveredItem === moduleItem.id ? moduleItem.color : "white",
          }}
          onMouseEnter={() => handleMouseEnter(moduleItem.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            navigate(moduleItem.path);
          }}
        >
          {moduleItem.label}
        </button>
      ))}
    </div>
  );
}

export default Navigation;
