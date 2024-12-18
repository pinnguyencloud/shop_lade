import { Outlet, useNavigate } from "react-router-dom";

function Warehouses() {
  const navigate = useNavigate();
  return (
    <div className="py-10">
      <div className="mb-5">
        <div
          className="max-w-[150px] cursor-pointer"
          onClick={() => navigate("/warehouse")}
        >
          <h3 className="text-[28px] font-bold">Warehouse</h3>
          <p className="italic text-base">Quản lý kho hàng</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Warehouses;
