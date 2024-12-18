import { useEffect, useState } from "react";
import { useExport, useGobal, useImport, useSupplier } from "../../../contexts";
import { Outlet, useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { getAllExportsReceipt } from "../../../services/warehouses/exportService";
// import Modal from "../../../components/modal";

function CompletedExport() {
  const { convertToDateTime, formatCurrency } = useGobal();
  const { setFlag, listReceipts } = useExport();
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    if (listReceipts) {
      setReceipts(listReceipts);
    }
  }, [listReceipts]);
  
  const navegate = useNavigate();
  const tableTheadCss = "px-4 py-2 border border-gray-300 font-semibold";
  const tableTbodyCss =
    "px-4 py-2 border border-gray-300 text-sm text-gray-700 text-center";

  return (
    <div className="w-full min-h-[200px]">
      <h3 className="text-3xl font-semibold my-5 text-[#2563EB]">
        Lịch sử phiếu xuất kho
      </h3>
      <div className="mb-5 flex gap-5 "></div>
      <table className="w-full">
        <thead className="shadow border bg-white">
          <tr>
            <th className={`${tableTheadCss}`}>Mã phiếu</th>
            <th className={`${tableTheadCss}`}>Tên khách hàng</th>
            <th className={`${tableTheadCss}`}>Người tạo</th>
            <th className={`${tableTheadCss}`}>Đơn vị giao hàng</th>
            <th className={`${tableTheadCss}`}>Tổng số lượng</th>
            <th className={`${tableTheadCss}`}>Tổng GT đơn hàng</th>
            <th className={`${tableTheadCss}`}>Ngày tạo</th>
            <th className={`${tableTheadCss}`}>Action</th>
          </tr>
        </thead>
        <tbody className="max-h-[350px]">
          {receipts.length > 0 ? (
            receipts.map((receipt) => (
              <tr key={receipt.id} className="bg-white hover:bg-gray-50">
                <td className={`${tableTbodyCss}`}>{receipt.code}</td>
                <td className={`${tableTbodyCss}`}>{receipt.receiver_name}</td>
                <td className={`${tableTbodyCss}`}>{receipt.created_by}</td>
                <td className={`${tableTbodyCss}`}>{receipt.delivery_unit}</td>
                <td className={`${tableTbodyCss}`}>{receipt.total_quantity}</td>
                <td className={`${tableTbodyCss}`}>
                  {formatCurrency(+receipt.total_price)}
                </td>
                <td className={`${tableTbodyCss}`}>
                  {convertToDateTime(receipt.created_at)}
                </td>
                <td className={`${tableTbodyCss}`}>
                  <button
                    className="text-warning underline italic"
                    onClick={() =>
                      navegate(`${receipt.id}`, { state: { completed: true } })
                    }
                  >
                    Xem phiếu nhập
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-10 ">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <a
        className="text-gray-500 text-sm cursor-pointer my-5"
        onClick={() => navegate(-1)}
      >
        Trở lại
      </a>
      {/* <button onClick={() => setModal(true)}>mở modal</button>
      <Modal  isOpen={modal} closeBtn={true} onClose={() => setModal(false)}>
      </Modal> */}
      <Outlet />
    </div>
  );
}

export default CompletedExport;
