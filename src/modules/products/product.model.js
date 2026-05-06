const db = require("../../config/db");

exports.getAllWithUnits = async (categoryId = null) => {
  const result = await db.query(`
    SELECT p.*, c.name AS category_name, u.id AS unit_id, u.unit_name, u.price_sell
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_units u ON p.id = u.product_id
    WHERE ($1::int IS NULL OR p.category_id = $1)
    ORDER BY p.id
  `, [categoryId]);

  const map = {};
  result.rows.forEach(r => {
    if (!map[r.id]) map[r.id] = {
      id: r.id,
      name: r.name,
      barcode: r.barcode,
      image_url: r.image_url,
      category_id: r.category_id,
      category_name: r.category_name,
      created_at: r.created_at,
      units: []
    };
    if (r.unit_id) {
      map[r.id].units.push({
        id: r.unit_id,
        unit_name: r.unit_name,
        price_sell: r.price_sell
      });
    }
  });
  return Object.values(map);
};

exports.createProduct = async ({ name, barcode, image_url, category_id }) => {
  const result = await db.query(
    `INSERT INTO products(name, barcode, image_url, category_id)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    [name, barcode, image_url, category_id]
  );
  return result.rows[0].id;
};

exports.createUnit = async (data) => {
  const rs = await db.query(
    `INSERT INTO product_units(product_id, unit_name, price_sell)
     VALUES($1,$2,$3) RETURNING id`,
    [data.product_id, data.unit_name, data.price_sell]
  );
  return rs.rows[0].id;
};

exports.delete = async (id) => {
  await db.query("DELETE FROM products WHERE id = $1", [id]);
};

exports.findById = async (id) => {
  const product = await db.query("SELECT * FROM products WHERE id=$1", [id]);
  const units = await db.query(
    "SELECT * FROM product_units WHERE product_id=$1 ORDER BY id",
    [id]
  );

  return {
    ...product.rows[0],
    units: units.rows
  };
};

exports.updateProduct = async (id, name, barcode, category_id, image_url) => {
  await db.query(
    `UPDATE products 
     SET name=$1, barcode=$2, category_id=$3, image_url=$4
     WHERE id=$5`,
    [name, barcode, category_id, image_url, id]
  );
};

exports.updateUnit = async (id, unit_name, price_sell) => {
  await db.query(
    `UPDATE product_units 
     SET unit_name=$1, price_sell=$2 
     WHERE id=$3`,
    [unit_name, price_sell, id]
  );
};

exports.deleteUnitsNotIn = async (product_id, keepIds) => {
  if (keepIds.length === 0) {
    await db.query("DELETE FROM product_units WHERE product_id=$1", [product_id]);
  } else {
    await db.query(
      `DELETE FROM product_units 
       WHERE product_id=$1 AND id NOT IN (${keepIds.join(",")})`,
      [product_id]
    );
  }
};
