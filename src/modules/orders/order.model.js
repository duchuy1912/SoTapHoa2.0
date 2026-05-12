const db = require("../../config/db");

exports.createOrder = async (orderData, itemsData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    
    // Tạo đơn hàng
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, customer_paid, change_amount)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [orderData.user_id, orderData.total_amount, orderData.customer_paid, orderData.change_amount]
    );
    const orderId = orderResult.rows[0].id;

    // Thêm chi tiết đơn hàng
    for (const item of itemsData) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, unit_id, quantity, price_sell)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.unit_id, item.quantity, item.price_sell]
      );
    }

    await client.query("COMMIT");
    return orderId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.getOrderHistoryByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

exports.getOrderDetails = async (orderId, userId) => {
  // Lấy hóa đơn
  const orderResult = await db.query(
    `SELECT o.*, u.full_name as user_name 
     FROM orders o 
     LEFT JOIN users u ON o.user_id = u.id 
     WHERE o.id = $1 AND o.user_id = $2`,
    [orderId, userId]
  );
  
  if (orderResult.rows.length === 0) return null;
  const order = orderResult.rows[0];

  // Lấy chi tiết
  const itemsResult = await db.query(
    `SELECT oi.*, p.name as product_name, pu.unit_name 
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     LEFT JOIN product_units pu ON oi.unit_id = pu.id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  
  order.items = itemsResult.rows;
  return order;
};
