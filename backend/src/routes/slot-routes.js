import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import {
  getPublicSlots,
  getAuthenticatedSlots,
  createSlot,
  updateSlot,
  deleteSlot
} from "../controllers/slot-controller.js";

const router = express.Router();

// DEBUG ROUTE
router.get("/debug/all", async (req, res) => {
  try {
    const Slot = (await import("../models/slot-model.js")).default;
    const all = await Slot.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public
router.get("/all", getPublicSlots);

// Authenticated
router.post("/create", authMiddleware, createSlot);
router.get("/", authMiddleware, getAuthenticatedSlots);
router.put("/:id", authMiddleware, updateSlot);
router.delete("/:id", authMiddleware, deleteSlot);

export default router;
