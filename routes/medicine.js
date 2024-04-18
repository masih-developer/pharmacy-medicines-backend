const express = require("express");
const { createMedicine } = require("../controllers/medicine");

const router = express.Router();

router.post("/", createMedicine);

module.exports = router;
