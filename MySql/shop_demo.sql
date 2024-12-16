	DROP DATABASE IF EXISTS shop_lade;
	CREATE DATABASE shop_lade;
	USE shop_lade;


	-- 1. Tạo bảng categories
	CREATE TABLE categories (
	  id INT PRIMARY KEY AUTO_INCREMENT,
	  name VARCHAR(255) NOT NULL,
	  slug VARCHAR(255) NOT NULL UNIQUE,
	  parent_id INT,
	  image_url VARCHAR(255),
	  description TEXT,
	  sort_order INT DEFAULT 0,
	  tag varchar(255),
	  is_active BOOLEAN DEFAULT true,
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	  FOREIGN KEY (parent_id) REFERENCES categories(id)
	);

	-- 2. Tạo bảng customers
	CREATE TABLE customers (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		phone VARCHAR(20) NOT NULL UNIQUE,
		email VARCHAR(100),
		address TEXT,
		ward VARCHAR(100),
		district VARCHAR(100),
		province VARCHAR(100),
		notes TEXT,
		is_active BOOLEAN DEFAULT true,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

	-- 3. Tạo bảng suppliers
	CREATE TABLE suppliers (
		id INT AUTO_INCREMENT PRIMARY KEY,
		supplier_name VARCHAR(255) NOT NULL,
		address TEXT,
		phone VARCHAR(20) NOT NULL,
		email VARCHAR(100),
		tax_number VARCHAR(20),
		cooperation_day DATE,
		note TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- 4. Tạo bảng warehouse_imports
	CREATE TABLE warehouse_imports (
		id INT AUTO_INCREMENT PRIMARY KEY,
		code VARCHAR(50) NOT NULL UNIQUE,
		supplier_id INT NOT NULL,
		delivery_person NVARCHAR(255) NOT NULL,
		phone_number VARCHAR(15),
		created_by VARCHAR(255),
		total_quantity INT DEFAULT 0,
		total_price DECIMAL(15, 2) DEFAULT 0.00,
		status ENUM('draft', 'completed', 'cancelled') DEFAULT 'draft',
		notes TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
	);

	-- 5. Tạo bảng warehouse_import_details
	CREATE TABLE warehouse_import_details (
		id INT AUTO_INCREMENT PRIMARY KEY,
		warehouse_import_id INT NOT NULL,
		product_id VARCHAR(255) NOT NULL,
		attribute_id VARCHAR(255) NOT NULL,
		quantity INT NOT NULL,
		price DECIMAL(15, 2) NOT NULL,
		total_price DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * price) STORED,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (warehouse_import_id) REFERENCES warehouse_imports(id) ON DELETE CASCADE
	);

	-- 6. Tạo bảng inventory
	CREATE TABLE inventory (
		id INT AUTO_INCREMENT PRIMARY KEY,
		product_id VARCHAR(255) NOT NULL,
		stock_quantity INT DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- 7. Tạo bảng warehouse_exports
	CREATE TABLE warehouse_exports (
   id BIGINT PRIMARY KEY AUTO_INCREMENT,
   customer_id INT,
   receiver_name VARCHAR(100) NOT NULL,
   phone_number VARCHAR(20),
   created_by VARCHAR(255),
   address varchar(255),
   export_reason varchar(255),
   status ENUM('draft', 'completed', 'cancelled') DEFAULT 'draft',
   notes TEXT,
   delivery_unit VARCHAR(100),
   delivery_notes TEXT,
   expected_delivery_date DATE,
   total_quantity INT DEFAULT 0,
   total_price DECIMAL(15,2) DEFAULT 0.00,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (customer_id) REFERENCES customers(id)
);
	-- 8. Tạo bảng warehouse_export_details
	CREATE TABLE warehouse_export_details (
		id BIGINT PRIMARY KEY AUTO_INCREMENT,
		warehouse_export_id BIGINT NOT NULL,
		product_id VARCHAR(24) NOT NULL,
		attribute_id VARCHAR(24) NOT NULL,
		quantity INT NOT NULL DEFAULT 0,
		price DECIMAL(15,2) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (warehouse_export_id) REFERENCES warehouse_exports(id)
	);

	-- 9. Tạo bảng warehouse_export_history
	CREATE TABLE warehouse_export_history (
		id BIGINT PRIMARY KEY AUTO_INCREMENT,
		warehouse_export_id BIGINT NOT NULL,
		old_status ENUM('draft', 'completed', 'cancelled'),
		new_status ENUM('draft', 'completed', 'cancelled'),
		changed_by VARCHAR(255),
		reason TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (warehouse_export_id) REFERENCES warehouse_exports(id)
	);

	-- 10. Thêm dữ liệu mẫu cho customers
	INSERT INTO customers (name, phone, email, address, ward, district, province) VALUES
	('Nguyễn Văn A', '0123456789', 'nguyenvana@email.com', '123 Đường ABC', 'Phường 1', 'Quận 1', 'TP.HCM'),
	('Trần Thị B', '0987654321', 'tranthib@email.com', '456 Đường XYZ', 'Phường 2', 'Quận 2', 'TP.HCM');

	-- 11. Thêm dữ liệu mẫu cho categories
	INSERT INTO categories (name, slug, image_url, description) VALUES
	('Kệ treo tường', 'ketreotuong', '/images/categories/wandregale.jpg', 'Các loại kệ treo tường'),
	('Kệ đơn', 'kedon', '/images/categories/gondelregale.jpg', 'Các loại kệ đơn'),
	('Kệ đôi', 'kedoi', '/images/categories/kopfregale.jpg', 'Các loại kệ đầu'),
	('Kệ thuốc lá', 'kethuocla', '/images/categories/zigarettenregale.jpg', 'Kệ thuốc lá'),
	('Kệ trái cây', 'ketraicay', '/images/categories/obstregale.jpg', 'Kệ trưng bày hoa quả'),
	('Quầy bán hàng', 'quaybanhang', '/images/categories/verkaufstheken.jpg', 'Quầy bán hàng'),
	('Kệ bánh mì', 'kebanhmi', '/images/categories/kassenbereich.jpg', 'Kệ bánh mì'),
	('Khu vực bán hàng', 'khuvucbanhang', '/images/categories/kuhlschranke.jpg', 'Khu vực bán hàng'),
	('Tủ lạnh', 'tulanh', '/images/categories/kuhlvitrinen.jpg', 'Tủ lạnh'),
	('Tủ mát trưng bày', 'tumattrungbay', '/images/categories/edelstahlmobel.jpg', 'Tủ mát trưng bày'),
	('Đồ nội thất', 'donoithat', '/images/categories/brotregale.jpg', 'Đồ nội thất'),
	('Kệ bếp', 'kebep', '/images/categories/regal-einzelteile.jpg', 'Kệ bếp');

	-- 12. Thêm danh mục con
	SET @khuvucbanhang_id = (SELECT id FROM categories WHERE slug = 'khuvucbanhang');
	INSERT INTO categories (name, slug, parent_id, image_url, description) VALUES
	('Quầy thu ngân 1.7m', 'quaythungan1.7m', @khuvucbanhang_id, '/images/categories/wandregal-37.jpg', 'Quầy bán thu ngân 1.7m'),
	('Quầy thu ngân 2.5m', 'quaythungan2.5m', @khuvucbanhang_id, '/images/categories/wandregal-47-37.jpg', 'Quầy thu ngân 2.5m'),
	('Quầy thu ngân 2.9m', 'quaythungan2.9m', @khuvucbanhang_id, '/images/categories/wandregal-47-37.jpg', 'Quầy thu ngân 2.9m'),
	('Giỏ hàng nhựa', 'giohangnhua', @khuvucbanhang_id, '/images/categories/wandregal-47-37.jpg', 'Giỏ hàng nhựa'),
	('Xe đẩy mua sắm', 'xedaymuasam', @khuvucbanhang_id, '/images/categories/wandregal-47-37.jpg', 'Xe đẩy mua sắm'),
	('Quầy trưng bày', 'quaytrungbay', @khuvucbanhang_id, '/images/categories/wandregal-47-37.jpg', 'Quầy trưng bày');

	SET @tulanh_id = (SELECT id FROM categories WHERE slug = 'tulanh');
	INSERT INTO categories (name, slug, parent_id, image_url, description) VALUES 
	('Tủ lạnh cửa kính trong suốt', 'tulanhtrongsuot', @tulanh_id, '/images/categories/wandregal-37.jpg', 'Tủ lạnh cửa kính trong suốt'),
	('Tủ lạnh cửa nguyên khối', 'tulanhnguyenkhoi', @tulanh_id, '/images/categories/wandregal-47-37.jpg', 'Tủ lạnh cửa nguyên khối');

	SET @tumattrungbay_id = (SELECT id FROM categories WHERE slug = 'tumattrungbay');
	INSERT INTO categories (name, slug, parent_id, image_url, description) VALUES
	('Tủ mát đứng', 'tumatdung', @tumattrungbay_id, '/images/categories/wandregal-37.jpg', 'Tủ mát đứng'),
	('Tủ mát nằm', 'tumatnam', @tumattrungbay_id, '/images/categories/wandregal-47-37.jpg', 'Tủ mát nằm'),
	('Phụ kiện kính tủ mát', 'phukienkinhtumat', @tumattrungbay_id, '/images/categories/wandregal-47-37.jpg', 'Phụ kiện kính tủ mát đính kèm'),
	('Phụ kiện nắp tủ mát', 'phukiennaptumat', @tumattrungbay_id, '/images/categories/wandregal-47-37.jpg', 'Phụ kiện nắp tủ mát');

	SET @donoithat_id = (SELECT id FROM categories WHERE slug = 'donoithat');
	INSERT INTO categories (name, slug, parent_id, image_url, description) VALUES
	('Bàn làm bếp', 'banlambep', @donoithat_id, '/images/categories/wandregal-37.jpg', 'Bàn làm bếp'),
	('Tủ bếp', 'tubep', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Tủ bếp'),
	('Bồn rửa chén', 'bonruachen', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Bồn rửa chén'),
	('Tủ trưng bày bếp', 'tutrungbaybep', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Tủ trưng bày bếp'),
	('Máy hút mùi', 'mayhutmui', @donoithat_id, '/images/categories/wandregal-37.jpg', 'Máy hút mùi'),
	('Tủ bếp treo tường', 'tubeptreotuong', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Tủ bếp treo tường'),
	('Kệ treo tường bếp', 'ketreotuongbep', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Kệ treo tường bếp'),
	('Bồn rửa tay', 'bonruatay', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Bồn rửa tay'),
	('Máy sấy tay', 'maysaytay', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Máy sấy tay'),
	('Đồ đựng thực phẩm', 'dodungthucpham', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Đồ đựng thực phẩm'),
	('Giỏ mua hàng', 'giomuahang', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Giỏ mua hàng bẳng thép'),
	('Xe đẩy mua sắm', 'xedaymuasamthep', @donoithat_id, '/images/categories/wandregal-47-37.jpg', 'Xe đẩy mua sắm');

	SET @kebep_id = (SELECT id FROM categories WHERE slug = 'kebep');
	INSERT INTO categories (name, slug, parent_id, image_url, description) VALUES
	('Kệ phụ kiện', 'banlam', @kebep_id, '/images/categories/wandregal-37.jpg', 'kệ phụ kiện'),
	('Kệ đồ', 'kedo', @kebep_id, '/images/categories/wandregal-47-37.jpg', 'Kệ đồ');

	-- 13. Thêm dữ liệu mẫu cho suppliers
	INSERT INTO suppliers (supplier_name, address, phone, email, tax_number, cooperation_day, note) VALUES 
	('Công Ty TNHH ABC', '123 Đường Lớn, Quận 1, TP.HCM', '0123456789', 'contact@abc.vn', '1234567890', '2022-01-01', 'Cung cấp linh kiện điện tử'),
	('Công Ty TNHH XYZ', '456 Đường Nhỏ, Quận 3, TP.HCM', '0987654321', 'contact@abc.vn', '1234567890', '2022-01-01', 'Cung cấp linh kiện điện tử');

	-- Thêm dữ liệu mẫu vào bảng customers
	INSERT INTO customers (name, phone, email, address, ward, district, province) VALUES 
	('Nguyễn Văn A', '096855854', 'nguyenvana@email.com', '123 Đường ABC', 'Phường 1', 'Quận 1', 'TP.HCM'),
	('Trần Thị B', '0987654322', 'tranthib@email.com', '456 Đường XYZ', 'Phường 2', 'Quận 2', 'TP.HCM');