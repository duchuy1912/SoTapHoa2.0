const Order = require("./order.model");
const Product = require("../products/product.model");

exports.getPosPage = async (req, res) => {
  try {
    const products = await Product.getAllWithUnits();
    res.render("orders/pos", { products });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};

exports.checkout = async (req, res) => {
  try {
    const { total_amount, customer_paid, change_amount, product_id, unit_id, quantity, price_sell } = req.body;
    
    // Nếu không có sản phẩm nào
    if (!product_id) {
      return res.redirect("/orders/pos");
    }

    // Format input to array if single item
    const productIds = Array.isArray(product_id) ? product_id : [product_id];
    const unitIds = Array.isArray(unit_id) ? unit_id : [unit_id];
    const quantities = Array.isArray(quantity) ? quantity : [quantity];
    const prices = Array.isArray(price_sell) ? price_sell : [price_sell];

    const itemsData = [];
    for (let i = 0; i < productIds.length; i++) {
      itemsData.push({
        product_id: productIds[i],
        unit_id: unitIds[i] || null, // Có thể null nếu không chọn đơn vị
        quantity: quantities[i],
        price_sell: prices[i]
      });
    }

    const orderData = {
      user_id: req.user.id,
      total_amount,
      customer_paid,
      change_amount
    };

    const orderId = await Order.createOrder(orderData, itemsData);
    
    res.redirect(`/orders/${orderId}/receipt`);
  } catch (err) {
    console.error("LỖI CHECKOUT:", err);
    res.redirect("/orders/pos");
  }
};

exports.getHistoryPage = async (req, res) => {
  try {
    const orders = await Order.getOrderHistoryByUser(req.user.id);
    res.render("orders/history", { orders });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};

exports.getReceiptPage = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getOrderDetails(orderId, req.user.id);
    if (!order) return res.status(404).send("Không tìm thấy đơn hàng");
    res.render("orders/receipt", { order });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};
