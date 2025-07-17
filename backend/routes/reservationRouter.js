import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addReservation,listReservations,updateReservation  } from "../controllers/reservationController.js";

const reservationRouter = express.Router();

reservationRouter.post("/add",authMiddleware, addReservation);
reservationRouter.post("/status",authMiddleware, listReservations);
reservationRouter.get("/list",authMiddleware, updateReservation);

export default reservationRouter;