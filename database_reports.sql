-- SQL tạo các bảng và view cho chức năng báo cáo

-- Bảng imports và import_items đã tồn tại từ trước
-- CREATE TABLE imports (
--   id SERIAL PRIMARY KEY,
--   supplier_name VARCHAR(255) NOT NULL,
--   import_date DATE NOT NULL,
--   total_amount NUMERIC(10,2) NOT NULL,
--   note TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE import_items (
--   id SERIAL PRIMARY KEY,
--   import_id INTEGER REFERENCES imports(id) ON DELETE CASCADE,
--   product_id INTEGER REFERENCES products(id),
--   unit_id INTEGER REFERENCES product_units(id),
--   quantity INTEGER NOT NULL,
--   price_buy NUMERIC(10,2) NOT NULL
-- );

-- View báo cáo theo nhà cung cấp (Supplier Report)
CREATE OR REPLACE VIEW supplier_import_summary AS
SELECT 
  i.supplier_name,
  COUNT(i.id) as import_count,
  SUM(i.total_amount) as total_amount,
  AVG(i.total_amount) as avg_amount,
  MIN(i.import_date) as first_import_date,
  MAX(i.import_date) as last_import_date
FROM imports i
GROUP BY i.supplier_name
ORDER BY total_amount DESC;

-- View báo cáo chi tiết sản phẩm (Product Import Report)
CREATE OR REPLACE VIEW product_import_detail AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  pu.id as unit_id,
  pu.unit_name,
  SUM(ii.quantity) as total_quantity,
  COUNT(DISTINCT i.id) as import_times,
  AVG(ii.price_buy) as avg_price_buy,
  MIN(ii.price_buy) as min_price_buy,
  MAX(ii.price_buy) as max_price_buy,
  SUM(ii.quantity * ii.price_buy) as total_cost,
  MIN(i.import_date) as first_import_date,
  MAX(i.import_date) as last_import_date
FROM import_items ii
JOIN imports i ON ii.import_id = i.id
JOIN products p ON ii.product_id = p.id
JOIN product_units pu ON ii.unit_id = pu.id
GROUP BY p.id, p.name, pu.id, pu.unit_name
ORDER BY total_cost DESC;

-- View tổng hợp báo cáo hàng ngày
CREATE OR REPLACE VIEW daily_import_summary AS
SELECT 
  i.import_date,
  COUNT(i.id) as import_count,
  COUNT(DISTINCT i.supplier_name) as supplier_count,
  SUM(i.total_amount) as daily_total
FROM imports i
GROUP BY i.import_date
ORDER BY i.import_date DESC;

-- View báo cáo theo thời gian (tháng, quý, năm)
CREATE OR REPLACE VIEW monthly_import_summary AS
SELECT 
  DATE_TRUNC('month', i.import_date)::DATE as month,
  COUNT(i.id) as import_count,
  COUNT(DISTINCT i.supplier_name) as supplier_count,
  SUM(i.total_amount) as monthly_total,
  AVG(i.total_amount) as avg_import_value
FROM imports i
GROUP BY DATE_TRUNC('month', i.import_date)
ORDER BY month DESC;

-- Tạo index để tăng tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_imports_import_date ON imports(import_date);
CREATE INDEX IF NOT EXISTS idx_imports_supplier_name ON imports(supplier_name);
CREATE INDEX IF NOT EXISTS idx_import_items_import_id ON import_items(import_id);
CREATE INDEX IF NOT EXISTS idx_import_items_product_id ON import_items(product_id);