const express = require("express");
const {
  createMedicine,
  readMedicineFromXlsx,
} = require("../controllers/medicine");
const multer = require("multer");

const upload = multer();
const router = express.Router();

router.post("/", createMedicine);

router.post("/file", upload.single("excel"), readMedicineFromXlsx);

module.exports = router;
