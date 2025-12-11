// controllers/event.controller.js
import Event from "../models/event-model.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event" });
  }
};
// ... (rest of the controller functions, including createEvent, getAllEvents, etc.)

export const createBooking = async (req, res) => {
  // This try...catch block is essential for catching any errors
  // that occur during the booking process or if the function is called improperly.
  try {
    console.log("--- DEBUG: BOOKING REQUEST RECEIVED AND ROUTED CORRECTLY ---");

    // 💡 TEMPORARY: This is the placeholder logic to confirm the route is found.
    // It prevents the server from hanging or crashing.
    return res.status(200).json({ 
      success: true, 
      message: "Route reached! Implement booking logic now." 
    });

  } catch (error) {
    // If the server crashes here, the error will be logged to the terminal
    console.error("Error in createBooking controller:", error);
    
    // Send a 500 error response back to the client
    res.status(500).json({ 
      success: false, 
      message: "Server error occurred during booking attempt." 
    });
  }
};