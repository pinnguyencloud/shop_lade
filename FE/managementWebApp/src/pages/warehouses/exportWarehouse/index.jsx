import { Outlet } from "react-router-dom";

function ExportWarehouse() {
  return (
    <div className="px-3 min-h-[500px] h-auto">
      <div className="flex flex-col w-full items-center justify-center mb-8">
        <h3 className="text-4xl font-bold text-[#EF4444]">Quản lý xuất kho</h3>
      </div>
      <Outlet />
    </div>
  );
}

export default ExportWarehouse;
