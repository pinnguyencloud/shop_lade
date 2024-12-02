const multer = require("multer");
const path = require("path");

// Cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    // Giữ nguyên tên file gốc
    cb(null, file.originalname);
  },
});

// Bộ lọc file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false); // Lỗi nếu không phải ảnh
  }
};

// Khởi tạo Multer với giới hạn file upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng file (5MB)
    files: 10, // Giới hạn số lượng file upload
  },
});

module.exports = upload;
