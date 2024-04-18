const MedicineModel = require("../models/medicine");

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

module.exports = { createMedicine };
