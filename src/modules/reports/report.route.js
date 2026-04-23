const express = require("express");
const router = express.Router();
const controller = require("./report.controller");

router.get("/", controller.getReportsPage);
router.get("/export/supplier", controller.exportSupplierReport);
router.get("/export/product", controller.exportProductReport);

module.exports = router;