import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import multer from "multer";

import {
  createMedicine,
  deleteMedicine,
  getAllMedicines,
  readMedicineFromXlsx,
  updateMedicine,
} from "../controllers/medicine.js";
import { verifyAccessToken } from "../middleware/auth.js";

const upload = multer();
const router = Router();

/**
 * @openapi
 * /api/medicines:
 *   get:
 *     tags:
 *       - Medicine
 *     summary: get all Medicines.
 *     description: get all medicines.
 *     responses:
 *       200:
 *         description: return an Array of Medicines.
 *   post:
 *     tags:
 *       - Medicine
 */
router.get("/", verifyAccessToken, expressAsyncHandler(getAllMedicines));

router.post("/", verifyAccessToken, expressAsyncHandler(createMedicine));

router.post(
  "/file",
  upload.single("excel"),
  expressAsyncHandler(readMedicineFromXlsx),
);

router.put("/:id", expressAsyncHandler(updateMedicine));

router.delete("/:id", expressAsyncHandler(deleteMedicine));

export default router;
