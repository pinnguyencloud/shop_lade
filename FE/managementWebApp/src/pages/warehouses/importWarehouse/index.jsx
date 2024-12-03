import { Outlet } from "react-router-dom";

function ImportWarehouse() {
  return (
    <div className="px-3">
      <div className="flex flex-col w-full items-center justify-center mb-8">
        <h3 className="text-4xl font-bold text-warning">Quản lý nhập kho</h3>
      </div>
      <Outlet />
    </div>
  );
}

export default ImportWarehouse;
