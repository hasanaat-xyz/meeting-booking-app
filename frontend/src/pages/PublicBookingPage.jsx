import React, { useEffect, useState } from "react";
import api from "../components/Services/api.js";

const PublicBookingPage = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    purpose: ""
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        // FIX: Updated URL from /api/event/all to /api/slots/all
        const res = await api.get("/slots/all");
        setSlots(res.data.events);
        console.log(res.data);

      } catch (err) {
        console.error("Error fetching public slots:", err);
        // Handle error display if necessary
      }
    };

    fetchSlots();
  }, []);

  const handleBooking = async () => {
    if (!selectedSlot) return alert("Select a slot");

    try {
      // NOTE: Your booking endpoint is /event/book, check if this should be /api/bookings/book
      await api.post("/event/book", { 
        slotId: selectedSlot,
        ...form,
      });

      alert("Meeting booked successfully!");
      // Optionally reset form and state
      // setForm({ name: "", email: "", purpose: "" });
      // setSelectedSlot(null);
    } catch (err) {
      console.error("Booking failed:", err.response ? err.response.data : err.message);
      alert("Booking failed. See console for details.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Book a Meeting Slot
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Slots */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Available Slots</h2>

          {slots.length === 0 ? (
            <p className="text-gray-500">No slots currently available.</p>
          ) : (
            slots.map((slot) => (
              <button
                key={slot._id}
                className={`border p-3 rounded w-full text-left ${
                  selectedSlot === slot._id
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSlot(slot._id)}
              >
                {new Date(slot.date).toLocaleString()}
              </button>
            ))
          )}
        </div>

        {/* Booking Form */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Your Details</h2>

          <input
            type="text"
            placeholder="Your Name"
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value={form.email}
          />
          <textarea
            placeholder="Purpose of Meeting"
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            value={form.purpose}
          ></textarea>

          <button
            className="bg-green-600 text-white w-full py-2 rounded disabled:opacity-50"
            onClick={handleBooking}
            disabled={!selectedSlot || !form.name || !form.email || !form.purpose}
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;