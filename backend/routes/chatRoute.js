import express from "express";
import authMiddleware from "../middleware/auth.js";
import { chatWithGPT  } from "../controllers/chatController.js";

const chatRouter = express.Router();


chatRouter.get("/open-api", chatWithGPT);


export default chatRouter;