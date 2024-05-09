const express = require("express");
const {
  createMedicine,
  readMedicineFromXlsx,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicine.controller");
const multer = require("multer");
const { verifyAccessToken } = require("../middleware/auth.middleware");
const expressAsyncHandler = require("express-async-handler");

const upload = multer();
const router = express.Router();

router.get("/", verifyAccessToken, expressAsyncHandler(getAllMedicines));

router.post("/", verifyAccessToken, expressAsyncHandler(createMedicine));

router.post(
  "/file",
  upload.single("excel"),
  expressAsyncHandler(readMedicineFromXlsx)
);

router.put("/:id", expressAsyncHandler(updateMedicine));

router.delete("/:id", expressAsyncHandler(deleteMedicine));

module.exports = router;
