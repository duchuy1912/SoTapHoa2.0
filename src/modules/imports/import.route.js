const express = require("express");
const router = express.Router();
const importController = require("./import.controller");

router.get("/", importController.list);
router.get("/create", importController.createForm);
router.post("/create", importController.create);

module.exports = router;