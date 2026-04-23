const db = require("../../config/db");

exports.getAll = async () => {
  const { rows } = await db.query(`
    SELECT i.*, ii.quantity, ii.price_buy, p.name as product_name, pu.unit_name
    FROM imports i
    LEFT JOIN import_items ii ON i.id = ii.import_id
    LEFT JOIN products p ON ii.product_id = p.id
    LEFT JOIN product_units pu ON ii.unit_id = pu.id
    ORDER BY i.created_at DESC
  `);

  const map = {};
  rows.forEach(r => {
    if (!map[r.id]) {
      map[r.id] = {
        id: r.id,
        supplier_name: r.supplier_name,
        import_date: r.import_date,
        total_amount: r.total_amount,
        note: r.note,
        created_at: r.created_at,
        items: []
      };
    }
    if (r.product_name) {
      map[r.id].items.push({
        product_name: r.product_name,
        unit_name: r.unit_name,
        quantity: r.quantity,
        price_buy: r.price_buy
      });
    }
  });
  return Object.values(map);
};

exports.findById = async (id) => {
  const importData = await db.query("SELECT * FROM imports WHERE id=$1", [id]);
  const items = await db.query(`
    SELECT ii.*, p.name as product_name, pu.unit_name
    FROM import_items ii
    JOIN products p ON ii.product_id = p.id
    JOIN product_units pu ON ii.unit_id = pu.id
    WHERE ii.import_id = $1
  `, [id]);

  return {
    ...importData.rows[0],
    items: items.rows
  };
};

exports.create = async (data) => {
  const { supplier_name, import_date, total_amount, note, items } = data;

  const importResult = await db.query(
    `INSERT INTO imports(supplier_name, import_date, total_amount, note)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [supplier_name, import_date, total_amount, note]
  );
  const importId = importResult.rows[0].id;

  for (const item of items) {
    await db.query(
      `INSERT INTO import_items(import_id, product_id, unit_id, quantity, price_buy)
       VALUES ($1, $2, $3, $4, $5)`,
      [importId, item.product_id, item.unit_id, item.quantity, item.price_buy]
    );
  }

  return importId;
};

exports.update = async (id, data) => {
  const { supplier_name, import_date, total_amount, note, items } = data;

  await db.query(
    `UPDATE imports SET supplier_name=$1, import_date=$2, total_amount=$3, note=$4 WHERE id=$5`,
    [supplier_name, import_date, total_amount, note, id]
  );

  // Delete old items
  await db.query("DELETE FROM import_items WHERE import_id=$1", [id]);

  // Insert new items
  for (const item of items) {
    await db.query(
      `INSERT INTO import_items(import_id, product_id, unit_id, quantity, price_buy)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, item.product_id, item.unit_id, item.quantity, item.price_buy]
    );
  }
};

exports.delete = async (id) => {
  await db.query("DELETE FROM import_items WHERE import_id=$1", [id]);
  await db.query("DELETE FROM imports WHERE id=$1", [id]);
};
