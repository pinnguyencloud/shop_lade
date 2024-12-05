import React, { useEffect } from "react";
import { CloseBtnIcon } from "../assets/icons";

const Modal = ({
  isOpen,
  onClose,
  className,
  children,
  title = "",
  closeBtn,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleFocus = (e) => {
      if (isOpen && !e.target.closest(".modal-content")) {
        e.target.blur(); //hủy focus
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("focusin", handleFocus);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocus);
    };
  }, [isOpen, onClose]);
  // sử dụng useEffect để xử lý sự kiện ấn nút để thoát.
  useEffect(() => {
    // Chặn cuộn khi modal mở
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // Khôi phục cuộn khi đóng modal
    }

    return () => {
      document.body.style.overflow = "auto"; // Đảm bảo khôi phục khi component unmount
    };
  }, [isOpen]);
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity cursor-default duration-300 z-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-5 h-auto relative  transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } ${className} modal-content`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {closeBtn && (
          <button
            className="absolute right-10 opacity-50 hover:opacity-100 transition-opacity
             duration-100 top-7 flex items-center justify-center"
            onClick={onClose}
          >
            <CloseBtnIcon />
          </button>
        )}
        {title && (
          <h2 className="text-xl font-bold mb-4 border-b-2 p-2 border-slate-200 ">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
