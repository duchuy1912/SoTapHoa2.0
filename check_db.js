const db = require("./src/config/db");

async function check() {
  try {
    const res1 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'");
    console.log("Orders columns:", res1.rows.map(r => r.column_name));
    
    const res2 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items'");
    console.log("Order items columns:", res2.rows.map(r => r.column_name));
    
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}

check();
