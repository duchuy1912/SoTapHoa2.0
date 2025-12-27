const express = require("express");
const router = express.Router();
const controller = require("./product.controller");
const upload = require("../../config/upload");

// danh sách sản phẩm
router.get("/", controller.getAllProducts);

// form thêm sản phẩm
router.get("/create", controller.showCreateForm);

// lưu sản phẩm
router.post("/create", upload.single("image"), controller.createProduct);

// xoá sản phẩm
router.post("/delete/:id", controller.deleteProduct);

router.get("/edit/:id", controller.showEditForm);
router.post("/edit/:id", upload.single("image"), controller.updateProduct);

module.exports = router;
