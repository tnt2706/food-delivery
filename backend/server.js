import express from "express";
import config from "./config";
import cors from "cors";
import { connectDB } from "./initialize/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// app config
const app = express();
const port = config.port;

//middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/env-check", (req, res) => {
  console.log("Environment Variables:", {
    MONGO_URL: process.env.MONGO_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  });
  res.send("Đã log biến môi trường!");
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
