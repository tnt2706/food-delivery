import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";


const AutoIncrement = AutoIncrementFactory(mongoose);

const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true }, // tự tăng
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

orderSchema.plugin(AutoIncrement, { inc_field: "orderNumber" });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
