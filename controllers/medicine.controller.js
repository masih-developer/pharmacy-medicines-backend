const MedicineModel = require("../models/medicine.model");
const xlsx = require("xlsx");
const { randomDate } = require("../utils");
const createHttpError = require("http-errors");
const { medicineValidationSchema } = require("../validators/medicine");
const mongoose = require("mongoose");

const getAllMedicines = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const regexSearch = new RegExp(search, "i");

  try {
    const medicines = await MedicineModel.find({ name: regexSearch })
      .sort({ _id: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalDocuments = await MedicineModel.countDocuments({
      name: regexSearch,
    });
    const totalPage = Math.ceil(totalDocuments / parseInt(limit));

    res.json({ medicines, totalPage, currentPage: +page });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createMedicine = async (req, res) => {
  const medicine = await medicineValidationSchema.validate(req.body);
  const medicineExist = await MedicineModel.findOne({ code: medicine.code });
  if (medicineExist)
    throw createHttpError.Conflict("این کد کالا قبلاً ثبت شده است!");
  await MedicineModel.create(medicine);
  res.status(200).json(medicine);
};

const readMedicineFromXlsx = async (req, res) => {
  const fileBuffer = req.file.buffer;

  try {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let data = xlsx.utils.sheet_to_json(sheet);

    data = data.map((med) => {
      return {
        name: med["نام کالا"] || "",
        expire: randomDate().toISOString(),
        code: med["کد کالا"] || 0,
        quantity: med["کل موجودي"] !== undefined ? med["کل موجودي"] : 0,
        price: med["قيمت1"] || 0,
        type: med["واحد اصلي"] || "",
      };
    });

    const results = [];

    for (const record of data) {
      try {
        const medicine = new MedicineModel(record);

        const savedMedicine = await medicine.save();

        results.push(savedMedicine);
      } catch (error) {
        console.error("Error saving medicine record:", error);
        results.push({ error: error.message, record });
      }
    }

    res.json({ message: "success" });
  } catch (error) {
    // Handle any parsing errors
    console.error("Error parsing XLSX file:", error);
    res.status(500).send("Error parsing XLSX file");
  }
};

const updateMedicine = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw createHttpError("آیدی محصول نامعتبر می باشد!");

  const medicine = await medicineValidationSchema.validate(req.body);

  const updatedMedicine = await MedicineModel.findByIdAndUpdate(id, medicine, {
    new: true,
  });

  if (!updatedMedicine)
    throw createHttpError.NotFound("محصول موردنظر پیدا نشد!");

  res.json(updatedMedicine);
};

const deleteMedicine = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    throw createHttpError("آیدی محصول نامعتبر می باشد!");

  const deletedMedicine = await MedicineModel.findByIdAndDelete(id);

  if (!deletedMedicine)
    throw createHttpError.NotFound("محصول مورد نظر پیدا نشد!");

  res.json({ message: "محصول مورد نظر با موفقیت حذف گردید." });
};

module.exports = {
  createMedicine,
  readMedicineFromXlsx,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
};
