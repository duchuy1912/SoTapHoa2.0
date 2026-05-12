require("dotenv").config();
const Order = require("./src/modules/orders/order.model");
const db = require("./src/config/db");

async function test() {
  try {
    const p = await db.query("SELECT id FROM products LIMIT 1");
    if (p.rows.length === 0) throw new Error("No products in DB");
    const validProductId = p.rows[0].id;
    
    const orderData = {
      user_id: 1, // Assume admin user id is 1
      total_amount: "50000",
      customer_paid: "50000",
      change_amount: "0"
    };
    
    const itemsData = [
      {
        product_id: validProductId.toString(),
        unit_id: null,
        quantity: "1",
        price_sell: "50000"
      }
    ];
    
    console.log("Input data:", orderData, itemsData);
    
    const id = await Order.createOrder(orderData, itemsData);
    console.log("Created order:", id);
    process.exit(0);
  } catch (err) {
    console.error("LỖI:", err.message);
    process.exit(1);
  }
}
test();
