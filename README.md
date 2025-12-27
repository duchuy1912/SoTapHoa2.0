# SoTapHoa (Website quản lý sản phẩm)

## Mô tả
Website quản lý sản phẩm đơn giản cho cửa hàng tạp hóa.

## Công nghệ sử dụng
- Node.js
- Express.js
- PostgreSQL
- MVC Pattern

## Cài đặt

## Database 

### Bảng 1: categories – Phân loại hàng
categories
- id (PK, SERIAL)
- name
- description
- created_at

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


### BẢNG 2: products (SẢN PHẨM GỐC)
products
- id (PK, SERIAL)
- name
- barcode
- image_url
- category_id (FK → categories.id)
- created_at


CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  barcode VARCHAR(50),
  image_url TEXT,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

### BẢNG 3: product_units (ĐƠN VỊ + GIÁ)
product_units
- id (PK)
- product_id (FK → products.id)
- unit_name
- quantity
- price_sell
- create_at

CREATE TABLE product_units (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  unit_name TEXT NOT NULL,
  price_sell INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);


