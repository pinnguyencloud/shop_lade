import { useEffect, useState } from "react";
import { useGobal, useImport, useSupplier } from "../../../contexts";
import { Outlet, useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import Modal from "../../../components/modal";

function CompletedReceipt() {
  const { receipts, setQueryParam, queryParam } = useImport();
  const { convertToDateTime, formatCurrency } = useGobal();
  const [modal, setModal] = useState(false);
  const { suppliers } = useSupplier();

  const [searchCompletedReceipt, setSearchCompletedReceipt] = useState({
    code: "",
    supplierId: "",
  });
  const navegate = useNavigate();
  const tableTheadCss = "px-4 py-2 border border-gray-300 font-semibold";
  const tableTbodyCss =
    "px-4 py-2 border border-gray-300 text-sm text-gray-700 text-center";

  const debounceQuery = useDebounce(searchCompletedReceipt, 500);

  useEffect(() => {
    if (!debounceQuery) {
      return;
    }

    setQueryParam((prev) => ({
      ...prev,
      code: debounceQuery.code,
      supplierId: +debounceQuery.supplierId,
    }));
  }, [searchCompletedReceipt]);

  useEffect(() => {
    if (queryParam?.status !== 1) {
      setQueryParam((prev) => ({
        ...prev,
        status: 1,
      }));
    }
  }, [queryParam, setQueryParam]);

  const handleChangeSearch = (e) => {
    setSearchCompletedReceipt((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full min-h-[200px]">
      <h3 className="text-3xl font-semibold my-5 text-[#2563EB]">
        Lịch sử phiếu nhập hàng
      </h3>
      <div className="mb-5 flex gap-5 ">
        <input
          name="code"
          value={searchCompletedReceipt.code}
          onChange={handleChangeSearch}
          className="w-80 px-5 py-2 rounded placeholder:italic text-sm border
          transition-all duration-200 text-[#2563EB]
           border-secondGray outline-none focus:border-[#2563EB]"
          placeholder="Nhập mã phiếu nhập kho"
        />
        <select
          className="bg-white text-gray-700 border border-gray-300 rounded-md
          transition-all duration-200
           p-2 focus:outline-none focus:ring-2 focus:ring-blue-[#2563EB]"
          value={searchCompletedReceipt.supplierId}
          onChange={handleChangeSearch}
          name="supplierId"
          id="supplierId"
        >
          <option value="">Chọn nhà cung cấp</option>
          {suppliers &&
            suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.supplier_name}
              </option>
            ))}
        </select>
      </div>
      <table className="w-full">
        <thead className="shadow border bg-white">
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
        <tbody className="max-h-[350px]">
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

export default CompletedReceipt;
