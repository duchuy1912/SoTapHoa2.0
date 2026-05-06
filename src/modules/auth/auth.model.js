const db = require("../../config/db");
const bcrypt = require("bcrypt");

// Tìm user theo email
exports.findByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// Tìm user theo ID
exports.findById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

// Tìm user theo Google ID
exports.findByGoogleId = async (googleId) => {
  const result = await db.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
  return result.rows[0];
};

// Tạo user mới
exports.create = async (data) => {
  const { email, password, full_name, phone = null, address = null } = data;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const result = await db.query(
    `INSERT INTO users (email, password, full_name, phone, address)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, full_name, created_at`,
    [email, hashedPassword, full_name, phone, address]
  );
  
  return result.rows[0];
};

// Tạo user từ Google
exports.createFromGoogle = async (data) => {
  const { googleId, email, full_name, avatar_url } = data;
  
  const result = await db.query(
    `INSERT INTO users (google_id, email, full_name, avatar_url, is_active)
     VALUES ($1, $2, $3, $4, true)
     RETURNING id, email, full_name, avatar_url, created_at`,
    [googleId, email, full_name, avatar_url]
  );
  
  return result.rows[0];
};

// Xác minh password
exports.verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Cập nhật last login
exports.updateLastLogin = async (userId) => {
  await db.query(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
    [userId]
  );
};

// Tạo session
exports.createSession = async (userId, token, expiresAt, ipAddress, userAgent) => {
  const result = await db.query(
    `INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, token, expiresAt, ipAddress, userAgent]
  );
  return result.rows[0];
};

// Tìm session
exports.findSession = async (token) => {
  const result = await db.query(
    `SELECT s.*, u.id as user_id, u.email, u.full_name, u.avatar_url, u.role
     FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
    [token]
  );
  return result.rows[0];
};

// Xóa session
exports.deleteSession = async (token) => {
  await db.query("DELETE FROM sessions WHERE token = $1", [token]);
};

// Xóa session hết hạn
exports.deleteExpiredSessions = async () => {
  await db.query("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP");
};

// Cập nhật thông tin user
exports.update = async (userId, data) => {
  const { full_name, phone, address, avatar_url } = data;
  
  const result = await db.query(
    `UPDATE users SET 
      full_name = COALESCE($1, full_name),
      phone = COALESCE($2, phone),
      address = COALESCE($3, address),
      avatar_url = COALESCE($4, avatar_url),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, email, full_name, phone, address, avatar_url`,
    [full_name, phone, address, avatar_url, userId]
  );
  
  return result.rows[0];
};