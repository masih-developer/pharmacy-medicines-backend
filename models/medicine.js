const { Schema, model } = require("mongoose");

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const MedicineModel = model("Medicine", medicineSchema);

module.exports = MedicineModel;