import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("Connecting to MongoDB with URL:", process.env.MONGO_URL);
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }

  await mongoose
    .connect(
      process.env.MONGO_URL
    )
    .then(() =>console.log("DB Connected"));
};
