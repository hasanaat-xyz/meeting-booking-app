import express from "express";
import {
  createEvent,
  getAllEvents,
  getSingleEvent,
  createBooking
} from "../controllers/event-controller.js";

import { authMiddleware } from "../middleware/auth-middleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createEvent);
router.get("/all", getAllEvents);
router.get("/:id", getSingleEvent);
router.post("/book", createBooking);

export default router;
