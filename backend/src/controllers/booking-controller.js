import Booking from "../models/booking-model.js"; 
import User from "../models/user-model.js"; 
import SlotModel from "../models/slot-model.js"; // <-- 1. Import your Slot Model
import { sendEmail } from "../utils/sendEmail.js"; 

export const createBooking = async (req, res) => {
    // Assuming 'eventId' from the front-end is the ID of the Slot/Time-block booked
    const { eventId, userId, date, time, seats } = req.body; 

    try {
        // --- 1. Find the Slot and the Host ID ---
        const slot = await SlotModel.findById(eventId).select('hostId title').lean();
        
        if (!slot || !slot.hostId) {
            // This is a critical error: cannot book a non-existent slot or one without a host.
            return res.status(404).json({ success: false, message: "Slot not found or is missing host information." });
        }
        
        const hostId = slot.hostId;
        const eventTitle = slot.title || 'Event Booking';

        // --- 2. Create the new booking in the database ---
        const newBooking = await Booking.create({ eventId, userId, date, time, seats });
        
        // --- 3. Fetch Details for Booker and Host in Parallel ---
        // Fetch emails and names for both parties efficiently
        const [bookerUser, hostUser] = await Promise.all([
            User.findById(userId).select('email name').lean(),
            User.findById(hostId).select('email name').lean()
        ]);

        // --- Booker Details ---
        const bookerEmail = bookerUser?.email;
        const bookerName = bookerUser?.name || 'Client';

        // --- Host Details ---
        const hostEmail = hostUser?.email;
        const hostName = hostUser?.name || 'Host';

        
        // --- A. Send Email to the Booker (Client) ---
        if (bookerEmail) {
            const clientSubject = `✅ Your Booking is Confirmed for ${eventTitle}`;
            const clientHtml = `
                <h1 style="color: #1E40AF;">Confirmation for ${eventTitle}</h1>
                <p>Hello ${bookerName},</p>
                <p>Your booking with ${hostName} is confirmed for:</p>
                <ul>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Seats:</strong> ${seats}</li>
                </ul>
            `;
            await sendEmail(bookerEmail, clientSubject, clientHtml);
        }

        // --- B. Send Email to the Host (Organizer) ---
        // Ensure the host is not the booker, and we have the host's email
        if (hostEmail && hostEmail !== bookerEmail) { 
            const hostSubject = `🔔 New Booking Received: ${eventTitle}`;
            const hostHtml = `
                <h1 style="color: #059669;">New Booking Alert!</h1>
                <p>Hello ${hostName},</p>
                <p>A new booking has been made on your slot by ${bookerName}.</p>
                <ul>
                    <li><strong>Booked By:</strong> ${bookerName} (${bookerEmail || 'Email not available'})</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Seats:</strong> ${seats}</li>
                </ul>
            `;
            await sendEmail(hostEmail, hostSubject, hostHtml);
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully and notifications sent.",
            data: newBooking,
        });

    } catch (error) {
        console.error("Booking process failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("eventId").populate("userId");
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single booking by ID
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("eventId")
      .populate("userId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
