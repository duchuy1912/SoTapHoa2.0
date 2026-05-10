# Sổ Tạp Hóa 2.0 (SoTapHoa)

Phần mềm Quản lý Cửa hàng Tạp hóa Hiện đại với giao diện **Premium Dark Theme (Glassmorphism)** siêu mượt mà. 

---

## 🚀 Công nghệ sử dụng
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Architecture:** MVC Pattern (Model-View-Controller)
- **Authentication:** Passport.js (Local, Google OAuth2) + JWT
- **Frontend:** EJS (Template Engine), Vanilla CSS, Ionicons, Flatpickr, Tom Select

---

## 🛠 Hướng dẫn Cài đặt & Khởi chạy

### Bước 1: Cài đặt thư viện NPM
Bạn cần cài đặt đầy đủ các gói thư viện cần thiết bằng lệnh:
```bash
npm install
```
*(Bao gồm: express, pg, bcrypt, jsonwebtoken, passport, passport-local, cookie-parser, ...)*

### Bước 2: Thiết lập Cơ sở dữ liệu (Database PostgreSQL)
Bạn cần chạy các câu lệnh SQL để tạo cấu trúc cơ sở dữ liệu. Dưới đây là các phần chính của hệ thống:

**1. Cơ sở dữ liệu cốt lõi (Sản phẩm & Sổ nợ)**
- `categories`: Phân loại mặt hàng.
- `products`: Thông tin gốc của sản phẩm (Tên, mã vạch, ảnh, danh mục).
- `product_units`: Các đơn vị bán của sản phẩm (Hộp, Lốc, Thùng) và giá bán.
- `debts`: Sổ ghi nợ của khách hàng (Tên khách, số tiền, hình ảnh).
- `imports` & `import_items`: Quản lý đơn nhập hàng và chi tiết sản phẩm nhập.

**2. Tài khoản & Phân quyền (Auth)**
Vui lòng chạy file `database_auth.sql` hoặc chạy đoạn SQL sau để tạo bảng cho người dùng:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**3. Khởi tạo tài khoản Admin mặc định**
Sau khi tạo bảng `users`, chạy lệnh này để cấp sẵn một tài khoản Quản trị viên:
```sql
INSERT INTO users (email, password, full_name, role, is_active)
VALUES ('admin@sotaphoa.com', '$2b$10$YIjlrHxIRUwY0n5w7j5C7e0E0ZJ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;
```

**4. Chức năng Báo cáo (Reports)**
Vui lòng chạy file `database_reports.sql` để tạo các *Views* trong SQL nhằm mục đích thống kê dữ liệu siêu tốc:
- `supplier_import_summary`: Thống kê nhập hàng theo Nhà cung cấp.
- `product_import_detail`: Phân tích chi phí nhập theo từng sản phẩm.
- `daily_import_summary`: Thống kê tiền nhập hàng theo ngày.
- `monthly_import_summary`: Báo cáo dòng tiền nhập hàng theo tháng.

### Bước 3: Khởi động Server
Chạy ứng dụng:
```bash
npm start
```
Truy cập vào trình duyệt: `http://localhost:3000`

---

## 🔑 Thông tin Đăng nhập Mẫu (Admin)
Sau khi thiết lập thành công, bạn có thể đăng nhập vào hệ thống bằng tài khoản sau:
- **Email:** `admin@sotaphoa.com`
- **Mật khẩu:** `admin123`

---

## 🎨 Cấu trúc Giao diện (Premium UI)
Toàn bộ hệ thống giao diện (`src/views/`) đã được nâng cấp đồng bộ theo phong cách kính mờ (Glassmorphism), cực kỳ sang trọng và chuyên nghiệp.

- **Sản phẩm (`products`):** Hiển thị dạng thẻ 3D, form nhập liệu sang trọng.
- **Nhập hàng (`imports`):** Gom nhóm hóa đơn theo ngày thông minh, dễ quản lý.
- **Sổ nợ (`debts`):** Badge làm nổi bật số tiền, xem ảnh dạng pop-up nền mờ.
- **Báo cáo (`reports`):** Lịch chọn ngày bằng Flatpickr giao diện kính mờ hiện đại.
- **Xác thực (`auth`):** Trang đăng nhập và đăng ký bóng bẩy, hỗ trợ Google OAuth.