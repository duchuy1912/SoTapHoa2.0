const db = require("../../config/db");

// Báo cáo theo nhà cung cấp
exports.getSupplierReport = async (startDate = null, endDate = null) => {
  let query = `
    SELECT
      i.supplier_name,
      COUNT(i.id) as import_count,
      COALESCE(SUM(i.total_amount), 0) as total_amount,
      COALESCE(AVG(i.total_amount), 0) as avg_amount,
      MIN(i.import_date) as first_import_date,
      MAX(i.import_date) as last_import_date
    FROM imports i
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY i.supplier_name ORDER BY total_amount DESC`;

  const result = await db.query(query, params);
  return result.rows;
};

// Báo cáo chi tiết sản phẩm
exports.getProductReport = async (startDate = null, endDate = null) => {
  let query = `
    SELECT
      p.id as product_id,
      p.name as product_name,
      pu.id as unit_id,
      pu.unit_name,
      COALESCE(SUM(ii.quantity), 0) as total_quantity,
      COUNT(DISTINCT i.id) as import_times,
      COALESCE(AVG(ii.price_buy), 0) as avg_price_buy,
      COALESCE(MIN(ii.price_buy), 0) as min_price_buy,
      COALESCE(MAX(ii.price_buy), 0) as max_price_buy,
      COALESCE(SUM(ii.quantity * ii.price_buy), 0) as total_cost,
      MIN(i.import_date) as first_import_date,
      MAX(i.import_date) as last_import_date
    FROM import_items ii
    JOIN imports i ON ii.import_id = i.id
    JOIN products p ON ii.product_id = p.id
    JOIN product_units pu ON ii.unit_id = pu.id
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY p.id, p.name, pu.id, pu.unit_name ORDER BY total_cost DESC`;

  const result = await db.query(query, params);
  return result.rows;
};

// Báo cáo theo ngày
exports.getDailyReport = async (startDate = null, endDate = null) => {
  let query = `
    SELECT
      i.import_date,
      COUNT(i.id) as import_count,
      COUNT(DISTINCT i.supplier_name) as supplier_count,
      COALESCE(SUM(i.total_amount), 0) as daily_total
    FROM imports i
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY i.import_date ORDER BY i.import_date DESC`;

  const result = await db.query(query, params);
  return result.rows;
};

// Báo cáo theo tháng
exports.getMonthlyReport = async (year = null) => {
  let query = `
    SELECT
      DATE_TRUNC('month', i.import_date)::DATE as month,
      COUNT(i.id) as import_count,
      COUNT(DISTINCT i.supplier_name) as supplier_count,
      COALESCE(SUM(i.total_amount), 0) as monthly_total,
      COALESCE(AVG(i.total_amount), 0) as avg_import_value
    FROM imports i
  `;

  const params = [];
  if (year) {
    query += ` WHERE EXTRACT(YEAR FROM i.import_date) = $1`;
    params.push(year);
  }

  query += ` GROUP BY DATE_TRUNC('month', i.import_date) ORDER BY month DESC`;

  const result = await db.query(query, params);
  return result.rows;
};

// Thống kê tổng hợp
exports.getOverallStats = async (startDate = null, endDate = null) => {
  let query = `
    SELECT
      COUNT(i.id) as total_imports,
      COUNT(DISTINCT i.supplier_name) as total_suppliers,
      COUNT(DISTINCT ii.product_id) as total_products,
      COALESCE(SUM(i.total_amount), 0) as total_spent,
      COALESCE(AVG(i.total_amount), 0) as avg_import_value,
      MIN(i.import_date) as first_import_date,
      MAX(i.import_date) as last_import_date
    FROM imports i
    LEFT JOIN import_items ii ON i.id = ii.import_id
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  const result = await db.query(query, params);
  return result.rows[0];
};

// Top suppliers
exports.getTopSuppliers = async (limit = 5, startDate = null, endDate = null) => {
  let query = `
    SELECT
      i.supplier_name,
      COUNT(i.id) as import_count,
      COALESCE(SUM(i.total_amount), 0) as total_amount
    FROM imports i
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY i.supplier_name ORDER BY total_amount DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await db.query(query, params);
  return result.rows;
};

// Top products
exports.getTopProducts = async (limit = 5, startDate = null, endDate = null) => {
  let query = `
    SELECT
      p.id,
      p.name,
      pu.unit_name,
      COALESCE(SUM(ii.quantity), 0) as total_quantity,
      COALESCE(SUM(ii.quantity * ii.price_buy), 0) as total_cost
    FROM import_items ii
    JOIN imports i ON ii.import_id = i.id
    JOIN products p ON ii.product_id = p.id
    JOIN product_units pu ON ii.unit_id = pu.id
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY p.id, p.name, pu.unit_name ORDER BY total_cost DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await db.query(query, params);
  return result.rows;
};

// Báo cáo theo danh mục
exports.getCategoryReport = async (startDate = null, endDate = null) => {
  let query = `
    SELECT
      c.name as category_name,
      COALESCE(SUM(ii.quantity * ii.price_buy), 0) as total_cost
    FROM import_items ii
    JOIN imports i ON ii.import_id = i.id
    JOIN products p ON ii.product_id = p.id
    JOIN categories c ON p.category_id = c.id
  `;

  const params = [];
  if (startDate && endDate) {
    query += ` WHERE i.import_date BETWEEN $1 AND $2`;
    params.push(startDate, endDate);
  }

  query += ` GROUP BY c.id, c.name ORDER BY total_cost DESC`;

  const result = await db.query(query, params);
  return result.rows;
};