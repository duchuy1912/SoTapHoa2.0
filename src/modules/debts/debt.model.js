const db = require("../../config/db");

exports.getAll = async () => {
  const { rows } = await db.query(
    "SELECT * FROM debts ORDER BY created_at DESC"
  );
  return rows;
};

exports.findById = async (id) => {
  const { rows } = await db.query("SELECT * FROM debts WHERE id=$1", [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { customer_name, phone, total_money, note, image_url } = data;

  const { rows } = await db.query(
    `INSERT INTO debts(customer_name, phone, total_money, note, image_url)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [customer_name, phone, total_money, note, image_url]
  );
  return rows[0].id;
};

exports.update = async (id, data) => {
  const { customer_name, phone, total_money, note, image_url } = data;

  await db.query(
    `UPDATE debts SET customer_name=$1, phone=$2, total_money=$3, note=$4, image_url=$5 WHERE id=$6`,
    [customer_name, phone, total_money, note, image_url, id]
  );
};

exports.delete = async (id) => {
  await db.query("DELETE FROM debts WHERE id=$1", [id]);
};
exports.searchCustomer = async (keyword) => {
  const { rows } = await db.query(`
    SELECT DISTINCT ON (customer_name)
      customer_name, phone, image_url
    FROM debts
    WHERE LOWER(customer_name) LIKE LOWER($1)
    ORDER BY customer_name, created_at DESC
    LIMIT 8
  `, [`%${keyword}%`]);

  return rows;
};
