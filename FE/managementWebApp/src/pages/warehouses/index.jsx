import { Outlet } from "react-router-dom";

function Warehouses() {

  return (
    <div className="py-10 h-screen">
      <h3 className="text-[28px] font-bold">Warehouse</h3>
      <p className="italic text-base">Quản lý kho hàng</p>
      <Outlet />
    </div>
  );
}

export default Warehouses;
