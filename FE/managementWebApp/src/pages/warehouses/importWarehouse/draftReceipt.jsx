import { useEffect } from "react";
import { useGobal, useImport } from "../../../contexts";
import { Outlet, useNavigate } from "react-router-dom";

function DraftReceipt() {
  const { receipts, setQueryParam, queryParam } = useImport();
  const { convertToDateTime } = useGobal();
  const navegate = useNavigate();
  const tableTheadCss = "px-4 py-2 border border-gray-300 font-semibold";
  const tableTbodyCss =
    "px-4 py-2 border border-gray-300 text-sm text-gray-700";

  useEffect(() => {
    if (queryParam?.status !== 0) {
      setQueryParam((prev) => ({
        ...prev,
        status: 0,
      }));
    }
  }, [queryParam, setQueryParam]);

  return (
    <div className="w-full h-screen">
      <table className="w-full bg-white">
        <thead className="shadow border">
          <tr>
            <th className={`${tableTheadCss}`}>Mã phiếu</th>
            <th className={`${tableTheadCss}`}>Nhà phân phối</th>
            <th className={`${tableTheadCss}`}>Người tạo</th>
            <th className={`${tableTheadCss}`}>Người giao hàng</th>
            <th className={`${tableTheadCss}`}>Tổng số lượng</th>
            <th className={`${tableTheadCss}`}>Tổng giá nhập</th>
            <th className={`${tableTheadCss}`}>Ngày tạo</th>
            <th className={`${tableTheadCss}`}>Action</th>
          </tr>
        </thead>
        <tbody className="max-h-[350px] bg-white">
          {receipts.length > 0 ? (
            receipts.map((receipt) => (
              <tr key={receipt.id} className="bg-white hover:bg-gray-50">
                <td className={`${tableTbodyCss}`}>{receipt.code}</td>
                <td className={`${tableTbodyCss}`}>{receipt.supplier_name}</td>
                <td className={`${tableTbodyCss}`}>{receipt.created_by}</td>
                <td className={`${tableTbodyCss}`}>
                  {receipt.delivery_person}
                </td>
                <td className={`${tableTbodyCss}`}>{receipt.total_quantity}</td>
                <td className={`${tableTbodyCss}`}>{receipt.total_price}</td>
                <td className={`${tableTbodyCss}`}>
                  {convertToDateTime(receipt.created_at)}
                </td>
                <td className={`${tableTbodyCss}`}>
                  <button
                    className="text-warning italic underline"
                    onClick={() => navegate(`${id}`)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <div className="w-full flex items-center">Không có dữ liệu</div>
          )}
        </tbody>
      </table>
      <Outlet />
    </div>
  );
}

export default DraftReceipt;
