const db = require("../../config/db");

exports.getAllCategories = async () => {
  const result = await db.query(
    `SELECT * FROM categories ORDER BY name`
  );
  return result.rows;
};

exports.findById = async (id) => {
  const result = await db.query(
    `SELECT * FROM categories WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

exports.createCategory = async ({ name, description }) => {
  const result = await db.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING id`,
    [name, description]
  );
  return result.rows[0];
};
