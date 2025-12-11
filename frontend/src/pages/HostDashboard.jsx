import React, { useEffect, useState } from "react";
import api from "../components/Services/api";

const HostDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(""); // 🟢 RENAMED for clarity
  const [endTime, setEndTime] = useState(""); // 🟢 NEW STATE ADDED

  const fetchSlots = async () => {
    // NOTE: Your fetch is calling /event/all, but the route for slot data 
    // should probably be /api/slots (using the getAuthenticatedSlots controller)
    // but we'll focus on the 'addSlot' fix for now.
    const response = await api.get("/event/all"); 
    setSlots(response.data.events);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const addSlot = async () => {
    // 🟢 UPDATED CHECK: Ensure all three required fields are selected
    if (!date || !startTime || !endTime) {
      return alert("Select date, start time, and end time.");
    }

    try {
      // 🟢 CRITICAL FIX: Sending ONLY the three required fields
      await api.post("/slots/create", {
        date: date,       // e.g., '2024-10-25'
        startTime: startTime, // e.g., '10:00'
        endTime: endTime,   // e.g., '11:00'
      });

      alert("Slot added successfully!"); // Add success alert
      fetchSlots();
      
      // Optionally clear the form
      setDate("");
      setStartTime("");
      setEndTime("");

    } catch (err) {
      // Use the error message from the server if available
      alert(err.response?.data?.message || "Failed to add slot"); 
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manage Available Slots</h1>

      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <h2 className="text-lg font-semibold">Add New Slot</h2>

        <input
          type="date"
          className="border px-3 py-2 rounded w-full"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        
        {/* 🟢 INPUT 1: START TIME */}
        <input
          type="time"
          className="border px-3 py-2 rounded w-full"
          placeholder="Start Time"
          onChange={(e) => setStartTime(e.target.value)}
          value={startTime}
        />
        
        {/* 🟢 INPUT 2: END TIME (NEW INPUT FIELD) */}
        <input
          type="time"
          className="border px-3 py-2 rounded w-full"
          placeholder="End Time"
          onChange={(e) => setEndTime(e.target.value)}
          value={endTime}
        />

        <button
          onClick={addSlot}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Slot
        </button>
      </div>

      {/* ... rest of the component */}
    </div>
  );
};

export default HostDashboard;