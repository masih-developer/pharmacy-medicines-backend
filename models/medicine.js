import Model from "./index.js";

class Medicine extends Model {
  constructor() {
    super("Medicine", {
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
    });
  }
}
export default new Medicine().getModel();
