const db = require("../../config/db");

exports.getAllWithUnits = async () => {
  const result = await db.query(`
    SELECT p.*, u.id AS unit_id, u.unit_name, u.price_sell
    FROM products p
    LEFT JOIN product_units u ON p.id = u.product_id
    ORDER BY p.id
  `);

  const map = {};
  result.rows.forEach(r => {
    if (!map[r.id]) map[r.id] = { ...r, units: [] };
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

exports.createProduct = async ({ name, barcode, image_url }) => {
  const result = await db.query(
    `INSERT INTO products(name, barcode, image_url)
     VALUES ($1,$2,$3) RETURNING id`,
    [name, barcode, image_url]
  );
  return result.rows[0].id;
};

exports.createUnit = async ({ product_id, unit_name, price_sell }) => {
  await db.query(
    `INSERT INTO product_units(product_id, unit_name, price_sell)
     VALUES ($1,$2,$3)`,
    [product_id, unit_name, price_sell]
  );
};
// exports.delete = async (id) => {
//     await db.query(`DELETE FROM product_units WHERE product_id = $1`, [id]);
//     await db.query(`DELETE FROM products WHERE id = $1`, [id]);
// };
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

exports.updateProduct = async (id, name, barcode, image_url) => {
  await db.query(
    `UPDATE products 
     SET name=$1, barcode=$2, image_url=$3
     WHERE id=$4`,
    [name, barcode, image_url, id]
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
