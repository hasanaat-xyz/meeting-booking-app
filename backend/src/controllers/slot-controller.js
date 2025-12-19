import Slot from "../models/slot-model.js";

// Create Slot (host)
export const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slot = await Slot.create({
      hostId: req.user._id, // ensure we store hostId consistently
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isBooked: false,
    });

    res.status(201).json({ success: true, message: "Slot created successfully", slot });
  } catch (error) {
    console.error("Create Slot Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Public: get only future, unbooked slots
export const getPublicSlots = async (_req, res) => {
  try {
    const slots = await Slot.find({
      isBooked: false,
      startTime: { $gte: new Date() },
    }).sort({ startTime: 1 });

    res.status(200).json({ success: true, events: slots });
  } catch (error) {
    console.error("Get Public Slots Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Host: get authenticated user's slots
export const getAuthenticatedSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ hostId: req.user._id }).sort({ startTime: 1 });
    res.status(200).json({ success: true, slots });
  } catch (error) {
    console.error("Get Auth Slots Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Slot
export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    // Require host authentication
    const slot = await Slot.findOne({ _id: id, hostId: req.user._id });
    if (!slot) {
      return res.status(404).json({ message: "Slot not found or not authorized" });
    }

    // Normalize incoming values to Date objects
    const nextDate = date ? new Date(date) : slot.date;
    const nextStart = startTime
      ? new Date(startTime)
      : slot.startTime;
    const nextEnd = endTime
      ? new Date(endTime)
      : slot.endTime;

    // If only time strings are sent (HH:mm), combine with date
    const isTimeOnly = (value) => typeof value === "string" && value.length <= 5 && value.includes(":");
    const dateString = nextDate.toISOString().split("T")[0];
    const normalizedStart = isTimeOnly(startTime) ? new Date(`${dateString}T${startTime}`) : nextStart;
    const normalizedEnd = isTimeOnly(endTime) ? new Date(`${dateString}T${endTime}`) : nextEnd;

    // Validate required fields
    if (!normalizedStart || !normalizedEnd || !nextDate) {
      return res.status(400).json({ message: "Date, start time, and end time are required." });
    }

    // Validate ordering
    if (normalizedEnd <= normalizedStart) {
      return res.status(400).json({ message: "End time must be after start time." });
    }
    // Prevent overlaps with other slots of the same host
    const overlapping = await Slot.findOne({
      _id: { $ne: id },
      hostId: req.user._id,
      startTime: { $lt: normalizedEnd },
      endTime: { $gt: normalizedStart },
    });
    if (overlapping) {
      return res.status(400).json({ message: "This time overlaps with another slot." });
    }
    slot.date = nextDate;
    slot.startTime = normalizedStart;
    slot.endTime = normalizedEnd;
    const saved = await slot.save();
    res.status(200).json({ success: true, message: "Slot updated successfully", slot: saved });

  } catch (error) {
    console.error("Update Slot Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }  
};

// Delete Slot
export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findOne({ _id: id, hostId: req.user._id });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    await slot.deleteOne();
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error("Delete Slot Error:", error);
    res.stat
    us(500).json({ message: "Server error", error: error.message });
  }
};
