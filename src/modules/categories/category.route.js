const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Trang quản lý loại hàng – sắp làm 📂");
});

module.exports = router;
