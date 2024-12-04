import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "./modal";
import { useGobal, useImport } from "../contexts";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ReceiptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { receiptsDetail, fetchReceiptById } = useImport();
  const { convertToDateTime, numberToWords, formatCurrency, convertToDate } =
    useGobal();
  const tableTheadCss = "px-4 py-2 border border-black font-semibold";
  const tableTbodyCss = "px-4 py-2 border border-black  text-center";
  const toDay = Date.now();

  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      await fetchReceiptById(id);
    };
    fetchData();
  }, [id]);

  // Chặn scroll trang khi modal mở
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Chặn cuộn
    return () => {
      document.body.style.overflow = ""; // Khôi phục cuộn khi modal đóng
    };
  }, []);

  //   Hàm xuất PDF
  const handleExportPDF = async () => {
    const input = componentRef.current;

    if (!input) return;

    try {
      // Lấy ảnh canvas từ HTML
      const canvas = await html2canvas(input, { scale: 2 });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Kích thước trang A4 (210mm x 297mm)
      const a4Width = 210;
      const a4Height = 297;

      // Tính tỷ lệ để thu nhỏ nội dung vừa với trang A4
      const scaleX = a4Width / (canvasWidth * 0.264583);
      const scaleY = a4Height / (canvasHeight * 0.264583);
      const scale = Math.min(scaleX, scaleY); // Chọn tỷ lệ nhỏ hơn để vừa với trang

      // Tạo PDF với kích thước trang A4
      const pdf = new jsPDF("p", "mm", "a4");

      // Tính toán kích thước ảnh trên PDF
      const pdfWidth = canvasWidth * 0.264583 * scale;
      const pdfHeight = canvasHeight * 0.264583 * scale;

      // Lấy dữ liệu ảnh từ canvas
      const imgData = canvas.toDataURL("image/png");

      // Thêm ảnh vào PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Lưu PDF
      pdf.save(`${receiptsDetail.code}.pdf`);
    } catch (error) {
      console.error("Đã có lỗi xảy ra khi lưu PDF", error);
    }
  };
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "phieu-nhap-kho",
    onAfterPrint: () => alert("Đã in phiếu nhập kho xong!"),
  });

  return (
    <Modal
      title="CHI TIẾT PHIẾU NHẬP"
      isOpen={true}
      className={"w-4/5 h-[700px] overflow-hidden overflow-y-auto py-10"}
      onClose={() => navigate(-1)}
      closeBtn={true}
    >
      <div className="flex justify-end">
        <div className="flex gap-5">
          <button
            className="py-3 px-10 hover:text-[#00712D] rounded-lg font-bold border hover:border-[#00712D] 
              bg-[#00712D] hover:bg-white text-white active:scale-95 transition-all duration-300"
            onClick={handleExportPDF}
          >
            Xuất PDF
          </button>
          <button
            className="py-3 px-10 hover:text-[#F29F58] hover:bg-white rounded-lg font-bold border border-[#F29F58] 
              bg-[#F29F58] text-white active:scale-95 transition-all duration-300"
            onClick={handlePrint}
          >
            In phiếu
          </button>
        </div>
      </div>
      <div
        className="flex flex-col pt-5 pb-20 px-20 font-serif gap-3"
        ref={componentRef}
      >
        <div className="flex justify-between">
          <div className="max-w-[380px]">
            <h5 className="font-bold">CÔNG TY CỔ PHẦN H.A LADEN BAU</h5>
            <p>
              Số 45, đường số 59, phường 14, quận Gò Vấp, Thành phố Hồ Chí Minh,
              Việt Nam
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h5 className="font-bold">Mẫu số: 01-VT</h5>
            <p className="text-center italic text-sm">
              (Ban hành theo Thông tư số 200/2014/TT-BTC
              <br />
              Ngày 22/12/2014 của Bộ Tài chính)
            </p>
          </div>
        </div>
        {receiptsDetail && (
          <div className="w-full flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col items-center mb-5 gap-2">
              <h3 className="uppercase text-4xl font-semibold">
                phiếu nhập kho
              </h3>
              <div className="flex flex-col items-center">
                <span className="italic font-semibold">
                  {convertToDate(toDay)}
                </span>
                <span>Số: {receiptsDetail.code}</span>
              </div>
            </div>
            {/* Infomation */}
            <div className="flex justify-between">
              <div className="flex gap-10">
                <div className="w-[150px]">
                  <p>Nhà cung cấp:</p>
                  <p>Trạng thái:</p>
                  <p>Ghi chú:</p>
                </div>
                <div className="max-w-[400px]">
                  <p className=" ">{receiptsDetail.supplier_name}</p>
                  <p className=" ">
                    {receiptsDetail.status === "completed"
                      ? "Hoàn tất"
                      : "Bản nháp"}
                  </p>
                  <p className=" ">{receiptsDetail.notes}</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-[150px]">
                  <p>Người tạo phiếu:</p>
                  <p>Ngày nhập hàng:</p>
                  <p>Người giao hàng:</p>
                </div>
                <div className="">
                  <p className=" ">{receiptsDetail.created_by}</p>
                  <p className=" ">
                    {convertToDateTime(receiptsDetail.created_at)}
                  </p>
                  <p className=" ">
                    {receiptsDetail.delivery_person} |{" "}
                    {receiptsDetail.phone_number}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p>Giao tại: Kho H.A Laden bau</p>
              <p>
                Địa chỉ: Số 45, đường số 59, phường 14, quận Gò Vấp, Thành phố
                Hồ Chí Minh, Việt Nam
              </p>
            </div>
            {/* Receipt detail */}
            <table className="w-full">
              <thead>
                <tr>
                  <th className={tableTheadCss}>STT</th>
                  <th className={tableTheadCss}>Tên sản phẩm</th>
                  <th className={tableTheadCss}>Mã sản phẩm</th>
                  <th className={tableTheadCss}>Đơn vị tính</th>
                  <th className={tableTheadCss}>Số lượng</th>
                  <th className={tableTheadCss}>Đơn giá</th>
                  <th className={tableTheadCss}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {receiptsDetail.details &&
                  receiptsDetail?.details.map((detail, index) => (
                    <tr key={index}>
                      <td className={tableTbodyCss}>{index + 1}</td>
                      <td className={`${tableTbodyCss} max-w-[250px]`}>
                        {`${detail.productName} :`}
                        <br />
                        {Object.entries(detail.attribute.attributes.attributes)
                          .map(([key, value]) => `${key} : ${value}`)
                          .join(" / ")}
                      </td>
                      <td className={tableTbodyCss}>{detail.productCode}</td>
                      <td className={tableTbodyCss}>SP</td>
                      <td className={tableTbodyCss}>{detail.quantity}</td>
                      <td className={tableTbodyCss}>
                        {formatCurrency(+detail.price)}
                      </td>
                      <td className={tableTbodyCss}>
                        {formatCurrency(+detail.totalAmount)}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th className={tableTheadCss} colSpan={4}>
                    Tổng cộng:
                  </th>
                  <th className={tableTheadCss}>
                    {receiptsDetail.total_quantity}
                  </th>
                  <th className={tableTheadCss}></th>
                  <th className={tableTheadCss}>
                    {formatCurrency(+receiptsDetail?.total_price)}
                  </th>
                </tr>
              </tbody>
            </table>
            {/* Tổng tiền viết bằng chữ */}
            <div>
              <div>
                <p>
                  Tổng số tiền ( Viết bằng chữ ):{" "}
                  <span className="italic">
                    {numberToWords(+receiptsDetail.total_price)}
                  </span>
                </p>
                <p>Số chứng từ gốc kèm theo:</p>
              </div>
              <div className="flex justify-between h-[150px]">
                <div className="h-full flex flex-col justify-between items-center">
                  <p className="flex flex-col item-center font-semibold mt-6">
                    Người lập phiếu{" "}
                    <span className="text-center italic text-sm font-normal">
                      (Ký, họ tên)
                    </span>
                  </p>
                  <p className="font-semibold">
                    {receiptsDetail.delivery_person}
                  </p>
                </div>
                <div className="h-full flex flex-col justify-between items-center">
                  <p className="flex flex-col item-center font-semibold mt-6">
                    Người giao hàng{" "}
                    <span className="text-center italic text-sm font-normal">
                      (Ký, họ tên)
                    </span>
                  </p>
                  <p className="font-semibold">{receiptsDetail.created_by}</p>
                </div>
                <p className="flex flex-col item-center font-semibold mt-6">
                  Thủ kho{" "}
                  <span className="text-center italic text-sm font-normal">
                    (Ký, họ tên)
                  </span>
                </p>
                <div className="flex flex-col items-center">
                  <span className="italic">{convertToDate(toDay)}</span>
                  <p className="flex flex-col item-center font-semibold text-center leading-tight">
                    Kế toán trưởng <br />
                    (Hoặc bộ phận có nhu cầu nhập)
                    <span className="italic text-sm font-normal">
                      (Ký, họ tên)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ReceiptDetail;
