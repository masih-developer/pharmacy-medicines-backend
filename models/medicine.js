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
      index: true,
      unique: true,
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
    isHide: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const MedicineModel = model("Medicine", medicineSchema);

module.exports = MedicineModel;
