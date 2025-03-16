import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import { read, utils } from "xlsx";

import MedicineModel from "../models/medicine.js";
import { medicineValidationSchema } from "../validators/medicine/index.js";

const getAllMedicines = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    expire,
    quantity,
    price,
    code,
  } = req.query;
  const regexSearch = new RegExp(search, "i");

  const sortQuery = {};

  if (expire === "latest") {
    sortQuery.expire = -1;
  } else if (expire === "nearest") {
    sortQuery.expire = 1;
  }

  if (quantity === "maximum") {
    sortQuery.quantity = -1;
  } else if (quantity === "minimum") {
    sortQuery.quantity = 1;
  }

  if (price === "maximum") {
    sortQuery.price = -1;
  } else if (price === "minimum") {
    sortQuery.price = 1;
  }

  if (code === "maximum") {
    sortQuery.code = -1;
  } else if (code === "minimum") {
    sortQuery.code = 1;
  }

  try {
    const medicines = await MedicineModel.find({ name: regexSearch })
      .sort({ ...sortQuery, _id: -1 })
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    const totalDocuments = await MedicineModel.countDocuments({
      name: regexSearch,
    });
    const totalPage = Math.ceil(totalDocuments / parseInt(limit, 10));

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
    const workbook = read(fileBuffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let data = utils.sheet_to_json(sheet);

    data = data.map((med) => ({
      name: med["نام کالا"] || "",
      expire: new Date("2421-03-21"),
      code: med["کد کالا"] || 0,
      quantity: med["کل موجودي"] !== undefined ? med["کل موجودي"] : 0,
      price: med["قيمت1"] || 0,
      type: med["واحد اصلي"] || "",
    }));

    const results = await Promise.all(
      data.map(async (record) => {
        try {
          const medicine = new MedicineModel(record);
          return await medicine.save();
        } catch (error) {
          console.error("Error saving medicine record:", error);
          return { error: error.message, record };
        }
      }),
    );

    res.json({ message: "تمامی موارد با موفقیت اضافه گردید.", results });
  } catch (error) {
    console.error("Error parsing XLSX file:", error);
    res.status(500).send("Error parsing XLSX file");
  }
};

const updateMedicine = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
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
  if (!isValidObjectId(id))
    throw createHttpError("آیدی محصول نامعتبر می باشد!");

  const deletedMedicine = await MedicineModel.findByIdAndDelete(id);

  if (!deletedMedicine)
    throw createHttpError.NotFound("محصول مورد نظر پیدا نشد!");

  res.json({ message: "محصول مورد نظر با موفقیت حذف گردید." });
};

export {
  createMedicine,
  deleteMedicine,
  getAllMedicines,
  readMedicineFromXlsx,
  updateMedicine,
};
