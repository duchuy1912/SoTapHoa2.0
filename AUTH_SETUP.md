# SQL Authentication - Chạy những câu lệnh này trong database

## 1. Tạo bảng users
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Tạo bảng sessions
```sql
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Tạo indexes
```sql
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
```

## 4. Thêm user admin mẫu
```sql
-- Password: admin123
INSERT INTO users (email, password, full_name, role, is_active)
VALUES ('admin@sotaphoa.com', '$2b$10$YIjlrHxIRUwY0n5w7j5C7e0E0ZJ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;
```

## 5. Cài đặt NPM packages cần thiết
```bash
npm install bcrypt jsonwebtoken passport passport-local passport-google-oauth20 cookie-parser express-session
```


## Routes Authentication
- GET /auth/login - Trang đăng nhập
- POST /auth/login - Xử lý đăng nhập
- GET /auth/register - Trang đăng ký
- POST /auth/register - Xử lý đăng ký
- GET /auth/google - Đăng nhập với Google
- GET /auth/google/callback - Google callback
- GET /auth/logout - Đăng xuất

## Test Login Credentials
- Email: admin@sotaphoa.com
- Password: admin123