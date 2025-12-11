// src/controllers/slot-controller.js
import Slot from "../models/slot-model.js"; 

export const getPublicSlots = async (req, res) => {
  try {
    // Logic: Find slots that are NOT booked and have an endTime in the future
    const availableSlots = await Slot.find({
      isBooked: false, // <-- Filter 1: Must be available for public booking
      startTime: { $gte: new Date() } // <-- Filter 2: Must not have already passed
    }).sort({ startTime: 1 }); // Sort by start time ascending

    res.status(200).json({ 
      success: true, 
      events: availableSlots // Frontend expects 'events' based on PublicBookingPage.jsx
    });

  } catch (error) {
    console.error("Error fetching public slots:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while fetching slots." 
    });
  }
};
// ... (rest of the controller code is unchanged and correct)


// ----------------------------------------------------
// AUTHENTICATED/PRIVATE ROUTE HANDLERS
// ----------------------------------------------------

// POST /api/slots - Admin creates a new slot
export const createSlot = async (req, res) => {
  const hostId = req.user._id; 
  const { date, startTime, endTime } = req.body;

  if (!date || !startTime || !endTime) {
    return res.status(400).json({ message: "Slot date, start time, and end time are required." });
  }

  try {
    // Combine date + time into valid ISO timestamps
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const newSlot = await Slot.create({
      hostId,
      date: new Date(date),
      startTime: start,
      endTime: end,
      isBooked: false,
    });

    res.status(201).json({ 
      success: true, 
      slot: newSlot, 
      message: "Slot created successfully." 
    });

  } catch (error) {
    console.error("Error creating slot:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while creating slot." 
    });
  }
};

// GET /api/slots - Admin fetches their own slots
export const getAuthenticatedSlots = async (req, res) => {
  try {
    // Find slots created by the authenticated user
    const slots = await Slot.find({ hostId: req.user._id }).sort({ startTime: 1 });
    
    res.status(200).json({ 
      success: true, 
      slots: slots 
    });

  } catch (error) {
    console.error("Error fetching authenticated slots:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while fetching authenticated slots." 
    });
  }
};

// PUT /api/slots/:id - Admin updates an existing slot
export const updateSlot = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: id, hostId: req.user._id }, // Ensure only the host can update
      updates, 
      { new: true, runValidators: true } 
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found or you are not authorized to update it." });
    }

    res.status(200).json({ 
      success: true, 
      slot: updatedSlot, 
      message: `Slot ${id} updated successfully.` 
    });

  } catch (error) {
    console.error("Error updating slot:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while updating slot." 
    });
  }
};

// DELETE /api/slots/:id - Admin deletes a slot
export const deleteSlot = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedSlot = await Slot.findOneAndDelete({ 
        _id: id, 
        hostId: req.user._id // Ensure only the host can delete
    });

    if (!deletedSlot) {
      return res.status(404).json({ message: "Slot not found or you are not authorized to delete it." });
    }

    res.status(200).json({ 
      success: true, 
      message: `Slot ${id} deleted successfully.` 
    });

  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred while deleting slot." 
    });
  }
};