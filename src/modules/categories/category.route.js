const express = require("express");
const router = express.Router();
const controller = require("./category.controller");

router.get("/", controller.listCategories);
router.get("/create", controller.showCreateForm);
router.post("/create", controller.createCategory);

module.exports = router;
