import logo from "../../assets/images/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const tabs = [
    { id: "dashboard", label: "Dashboard", path: "/" },
    { id: "customers", label: "QL Khách hàng", path: "/customers" },
    { id: "product", label: "QL Sản phẩm", path: "/products" },
    { id: "warehouse", label: "QL Kho hàng", path: "/warehouse" },
    { id: "setting", label: "Cài đặt", path: "/setting" },
  ];
  return (
    <div className="w-[250px] h-full bg-white fixed border-r border-r-secondGray ">
      <img src={logo} alt="logo" className="w-full h-[88px] object-contain" />
      <div className="flex flex-col pl-5 items-start border-b mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-4 flex gap-4 text-left w-full text-lg cursor-pointer h-[56px] ${
              isActive(tab.path)
                ? "border-b-2 text-primary bg-success bg-opacity-50 rounded-l-full shadow opacity-100"
                : "text-gray-500 hover:text-blue-500 hover:bg-secondGray hover:bg-opacity-50 opacity-75"
            } transition-all duration-300 ease-in-out`}
          >
            <span>I</span>
            <button>{tab.label}</button>
          </div>
        ))}
        <div className="flex px-4 py-4 gap-4 text-left w-full text-lg text-gray-500">
          <span>I</span>
          <button>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
