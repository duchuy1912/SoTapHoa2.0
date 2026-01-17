const express = require("express");
const router = express.Router();
const controller = require("./debt.controller");
const upload = require("../../config/uploadDebt");

router.get("/", controller.getAllDebts);
router.get("/create", controller.showCreateForm);
router.post("/create", upload.single("image"), controller.createDebt);

router.get("/edit/:id", controller.showEditForm);
router.post("/edit/:id", upload.single("image"), controller.updateDebt);

router.post("/delete/:id", controller.deleteDebt);

router.get("/search-customer", controller.searchCustomer);

module.exports = router;
