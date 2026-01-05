const express = require("express");
const router = express.Router();
const controller = require("./product.controller");
const upload = require("../../config/upload");

router.get("/", controller.getAllProducts);
router.get("/create", controller.showCreateForm);
router.post("/create", upload.single("image"), controller.createProduct);

router.get("/edit/:id", controller.showEditForm);
router.post("/edit/:id", upload.single("image"), controller.updateProduct);

// ❌ SAI
// router.post('/delete/:id', productController.deleteProduct);

// ✅ ĐÚNG
router.post("/delete/:id", controller.deleteProduct);

module.exports = router;
