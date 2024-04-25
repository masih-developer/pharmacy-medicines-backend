const express = require("express");
const {
  createMedicine,
  readMedicineFromXlsx,
  getAllMedicines,
} = require("../controllers/medicine.controller");
const multer = require("multer");

const upload = multer();
const router = express.Router();

router.get("/", getAllMedicines);

router.post("/", createMedicine);

router.post("/file", upload.single("excel"), readMedicineFromXlsx);

module.exports = router;
