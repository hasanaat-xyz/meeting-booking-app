import React, { useState } from "react";
import SlotItem from "./SlotItem";
import { formatDate } from "../utils/formatDate";

const BookingForm = ({ selectedDate, availableSlots, onSubmit }) => {
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert("Please select a time slot");

    onSubmit({
      date: selectedDate,
      slot: selectedSlot,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">
        Booking for <span className="text-blue-600">{formatDate(selectedDate)}</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {availableSlots.length === 0 && (
          <p className="text-gray-500">No slots available for this date</p>
        )}

        {availableSlots.map((slot, i) => (
          <SlotItem
            key={i}
            slot={slot}
            selected={selectedSlot === slot}
            onSelect={setSelectedSlot}
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingForm;
