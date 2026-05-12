const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

router.get("/pos", orderController.getPosPage);
router.post("/checkout", orderController.checkout);
router.get("/history", orderController.getHistoryPage);
router.get("/:id/receipt", orderController.getReceiptPage);

module.exports = router;
