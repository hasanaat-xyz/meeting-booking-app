import express from "express";
import {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking-controller.js";

import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

// Create a new booking (protected route)
router.post("/create", authMiddleware, createBooking);

// Get all bookings
router.get("/all", authMiddleware, getAllBookings);

// Get a single booking by ID
router.get("/:id", authMiddleware, getSingleBooking);

// Update a booking by ID
router.put("/:id", authMiddleware, updateBooking);

// Delete a booking by ID
router.delete("/:id", authMiddleware, deleteBooking);

export default router;
