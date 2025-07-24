import express from "express";
import authMiddleware from "../middleware/auth.js";
import { chatWithGPT, chatWithGemini  } from "../controllers/chatController.js";

const chatRouter = express.Router();


chatRouter.get("/gemini", chatWithGemini);
chatRouter.get("/open-api", chatWithGPT);


export default chatRouter;