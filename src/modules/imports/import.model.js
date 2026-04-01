const db = require("../../config/db");

const Import = {
  // Lấy tất cả phiếu nhập
  getAll: async () => {
    const query = `
      SELECT i.*, s.name AS supplier_name
      FROM imports i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows; // ✅ trả về mảng
  },

  // Tạo phiếu nhập
  create: async (data) => {
    const { supplier_id, total_amount } = data;

    const query = `
      INSERT INTO imports (supplier_id, total_amount)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [supplier_id, total_amount]);
    return result.rows[0]; // ✅ trả về object
  },

  // Tổng tiền tháng này
  getSummaryThisMonth: async () => {
    const query = `
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM imports
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    `;
    const result = await db.query(query);
    return result.rows[0]; // ✅ object { total: ... }
  }
};

module.exports = Import;