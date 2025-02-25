import { model, Schema } from "mongoose";

export default class Model {
  constructor(name, schemaDefinition) {
    this.schema = new Schema(schemaDefinition, { timestamps: true });
    this.model = model(name, this.schema);
  }
  getModel() {
    return this.model;
  }
}
