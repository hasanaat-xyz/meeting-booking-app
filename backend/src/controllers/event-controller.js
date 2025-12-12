// controllers/event-controller.js
import Event from "../models/event-model.js";
import Booking from "../models/booking-model.js";
import Slot from "../models/slot-model.js";
import GoogleToken from "../models/google-token-model.js";
import User from "../models/user-model.js";

// Google Calendar helpers
import {
  setCredentials,
  createCalendarEvent,
} from "../utils/googlecalendar.js";

// Email utility
import { sendEmail } from "../utils/sendEmail.js";

/* ---------------------------------------------------
 * CREATE EVENT
 * --------------------------------------------------- */
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

/* ---------------------------------------------------
 * GET ALL EVENTS
 * --------------------------------------------------- */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/* ---------------------------------------------------
 * GET SINGLE EVENT
 * --------------------------------------------------- */
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

/* ---------------------------------------------------
 * BOOKING WITH GOOGLE CALENDAR INTEGRATION
 * --------------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    console.log("--- BOOKING REQUEST RECEIVED ---");

    const { slotId, name, email, purpose } = req.body;

    if (!slotId || !name || !email || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: slotId, name, email, and purpose are required",
      });
    }

    // 1️⃣ Fetch slot details and check availability
    const slot = await Slot.findById(slotId).populate('hostId', 'name email');
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    // Check if slot is already booked
    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    // Check if slot is in the past
    if (new Date(slot.startTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book a slot in the past",
      });
    }

    // 2️⃣ Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // 3️⃣ Save booking in DB
    const booking = await Booking.create({
      slotId,
      name,
      email,
      purpose,
    });

    console.log("Booking saved:", booking._id);

    // 4️⃣ Get host information for email notification
    const host = slot.hostId;
    const hostEmail = host?.email;
    const hostName = host?.name || 'Host';

    // Format date and time for email
    const slotDate = new Date(slot.startTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const slotStartTime = new Date(slot.startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const slotEndTime = new Date(slot.endTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // 5️⃣ Send email notification to host
    if (hostEmail) {
      const hostSubject = `🔔 New Meeting Booking: ${name} wants to meet`;
      const hostHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            New Meeting Booking Received
          </h1>
          <p>Hello ${hostName},</p>
          <p>A new meeting request has been booked for one of your available time slots.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Meeting Details:</h2>
            <p><strong>Booked By:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Date:</strong> ${slotDate}</p>
            <p><strong>Time:</strong> ${slotStartTime} - ${slotEndTime}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Please make sure to add this meeting to your calendar.
          </p>
        </div>
      `;
      
      try {
        await sendEmail(hostEmail, hostSubject, hostHtml);
        console.log(`Email notification sent to host: ${hostEmail}`);
      } catch (emailError) {
        console.error("Failed to send email to host:", emailError);
        // Don't fail the booking if email fails
      }
    }

    // 6️⃣ Optionally try to add to Google Calendar (non-blocking)
    try {
      const tokens = await GoogleToken.findOne();
      if (tokens) {
        setCredentials(tokens);
        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);

        await createCalendarEvent({
          summary: `Meeting with ${name}`,
          description: `Purpose: ${purpose}\nEmail: ${email}`,
          start: startTime,
          end: endTime,
        });
        console.log("Google Calendar Event Created!");
      }
    } catch (calendarError) {
      console.error("Google Calendar integration failed (non-critical):", calendarError);
      // Don't fail the booking if Google Calendar fails
    }

    // 7️⃣ Respond
    return res.status(201).json({
      success: true,
      message: "Booking created successfully! The host has been notified.",
      booking,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while booking",
      error: error.message,
    });
  }
};
