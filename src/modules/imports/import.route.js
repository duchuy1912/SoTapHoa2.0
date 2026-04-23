const express = require("express");
const router = express.Router();
const controller = require("./import.controller");

router.get("/", controller.getAllImports);
router.get("/create", controller.showCreateForm);
router.post("/create", controller.createImport);

router.get("/edit/:id", controller.showEditForm);
router.post("/edit/:id", controller.updateImport);

router.post("/delete/:id", controller.deleteImport);

module.exports = router;
