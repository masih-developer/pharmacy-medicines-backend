const MedicineModel = require("../models/medicine.model");
const xlsx = require("xlsx");
const { randomDate } = require("../utils");

const getAllMedicines = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const medicines = await MedicineModel.find({})
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const totalPage = Math.ceil((await MedicineModel.countDocuments()) / limit);

  res.json({ medicines, totalPage, currentPage: page });
};

const createMedicine = async (req, res) => {
  const medicine = req.body;
  try {
    await MedicineModel.create(medicine);
    res.status(200).json(medicine);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
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

module.exports = { createMedicine, readMedicineFromXlsx, getAllMedicines };
