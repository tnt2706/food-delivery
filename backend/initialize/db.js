import mongoose from "mongoose";
import config from "../config";

export const connectDB = async () => {
  await mongoose
    .connect(config.mongoUrl)
    .then(() =>console.log("DB Connected"));
};
