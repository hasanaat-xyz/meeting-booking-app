import React, { useEffect, useState } from "react";
import api from "../components/Services/api.js";

const PublicBookingPage = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    purpose: ""
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const res = await api.get("/slots/all");
        setSlots(res.data.events || []);
      } catch (err) {
        console.error("Error fetching public slots:", err);
        setMessage({ type: "error", text: "Failed to load available slots. Please try again later." });
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach((slot) => {
      const dateKey = new Date(slot.startTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });
    return grouped;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      setMessage({ type: "error", text: "Please select a time slot" });
      return;
    }

    if (!form.name || !form.email || !form.purpose) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    try {
      setBookingLoading(true);
      setMessage({ type: "", text: "" });

      const res = await api.post("/event/book", {
        slotId: selectedSlot,
        ...form,
      });

      setMessage({ type: "success", text: res.data.message || "Meeting booked successfully! The host has been notified." });

      setForm({ name: "", email: "", purpose: "" });
      setSelectedSlot(null);

      const slotsRes = await api.get("/slots/all");
      setSlots(slotsRes.data.events || []);
    } catch (err) {
      console.error("Booking failed:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || "Booking failed. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setBookingLoading(false);
    }
  };

  const groupedSlots = groupSlotsByDate(slots);
  const selectedSlotData = slots.find(s => s._id === selectedSlot);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-lavender-50 via-mint-50 to-peach-50 py-10 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-6 w-72 h-72 bg-lavender-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-8 w-96 h-96 bg-peach-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mint-200/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lavender-300 to-mint-300 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">📅</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book a Meeting</h1>
          <p className="text-gray-600">
            Select an available time slot and share your details to schedule.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-mint-50 text-mint-800 border-mint-200"
                : "bg-peach-50 text-peach-800 border-peach-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ⭐ CENTERED GRID HERE ⭐ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start mx-auto max-w-4xl">
          
          {/* Available Slots */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-7 border border-white/60 lg:max-w-[540px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Available Time Slots</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-lavender-100 text-lavender-700 font-semibold">
                {slots.length} slots
              </span>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Loading available slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No slots currently available.</p>
                <p className="text-gray-400 text-sm mt-2">Please check back later.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[620px] overflow-y-auto pr-1">
                {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                  <div key={date} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-lavender-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-lavender-400" />
                      {date}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dateSlots.map((slot) => (
                        <button
                          key={slot._id}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-left shadow-sm ${
                            selectedSlot === slot._id
                              ? "bg-gradient-to-r from-lavender-400 via-mint-400 to-peach-400 text-white border-transparent shadow-lg transform scale-[1.02]"
                              : "bg-white/70 hover:bg-lavender-50 border-lavender-100 hover:border-lavender-300"
                          }`}
                          onClick={() => {
                            setSelectedSlot(slot._id);
                            setMessage({ type: "", text: "" });
                          }}
                        >
                          <div className="font-semibold text-sm">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                          <p className="text-xs text-gray-600">
                            {new Date(slot.startTime).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-7 border border-white/60 lg:max-w-[520px]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Details</h2>

            {selectedSlotData && (
              <div className="mb-4 p-4 bg-lavender-50 rounded-xl border border-lavender-200">
                <p className="text-sm text-gray-600 mb-1">Selected Slot</p>
                <p className="font-semibold text-lavender-800">
                  {new Date(selectedSlotData.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-lavender-700">
                  {formatTime(selectedSlotData.startTime)} - {formatTime(selectedSlotData.endTime)}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/60 border-2 border-peach-100 rounded-xl placeholder-gray-400 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-peach-300 focus:border-peach-300 hover:border-peach-200 focus:bg-white"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  value={form.name}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 bg-white/60 border-2 border-lavender-100 rounded-xl placeholder-gray-400 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-lavender-300 hover:border-lavender-200 focus:bg-white"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  value={form.email}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purpose of Meeting <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Brief description of what you'd like to discuss..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white/60 border-2 border-mint-100 rounded-xl placeholder-gray-400 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300 hover:border-mint-200 focus:bg-white resize-none"
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  value={form.purpose}
                ></textarea>
              </div>

              <button
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
                  !selectedSlot || !form.name || !form.email || !form.purpose || bookingLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-lavender-400 via-mint-400 to-peach-400 shadow-lg shadow-lavender-200/50 hover:shadow-xl hover:shadow-lavender-300/50 transform hover:scale-[1.02]"
                }`}
                onClick={handleBooking}
                disabled={!selectedSlot || !form.name || !form.email || !form.purpose || bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Book Meeting Slot"}
              </button>

              {!selectedSlot && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Please select a time slot to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;
