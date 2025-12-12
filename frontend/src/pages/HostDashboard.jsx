import React, { useEffect, useState } from "react";
import api from "../components/Services/api";

const HostDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // State for handling updates
  const [isEditing, setIsEditing] = useState(null); // Stores the _id of the slot being edited
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  // 1. **CRITICAL FIX**: Fetching the host's own slots
  const fetchSlots = async () => {
    try {
      // ✅ Using the correct endpoint that authenticates the host and returns their slots
      const response = await api.get("/slots"); 
      if (response.data.success) {
        setSlots(response.data.slots || []); // ✅ The controller returns data as 'slots'
      } else {
        console.error("Failed to fetch slots:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching host slots:", error);
      if (error.response?.status === 401) {
        alert("You are not logged in. Please login again.");
        window.location.href = "/login";
      } else {
        alert("Failed to fetch your slots. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // --- CREATE LOGIC (from your original code) ---
  const addSlot = async () => {
    if (!date || !startTime || !endTime) {
      return alert("Please select date, start time, and end time.");
    }

    // Validate that end time is after start time
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (end <= start) {
      return alert("End time must be after start time.");
    }

    // Validate that the slot is not in the past
    if (start < new Date()) {
      return alert("Cannot create slots in the past.");
    }

    try {
      const response = await api.post("/slots/create", { date, startTime, endTime });

      if (response.data.success) {
        alert("Slot added successfully!");
        fetchSlots();
        
        setDate("");
        setStartTime("");
        setEndTime("");
      } else {
        alert(response.data.message || "Failed to add slot");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add slot";
      console.error("Error adding slot:", err);
      
      if (err.response?.status === 401) {
        alert("You are not logged in. Please login again.");
        window.location.href = "/login";
      } else {
        alert(`Error: ${errorMessage}`);
      }
    }
  };
  
  // --- DELETE LOGIC ---
  const deleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) {
      return;
    }

    try {
      // 🎯 Calls DELETE /api/slots/:id
      await api.delete(`/slots/${slotId}`);
      alert("Slot deleted successfully!");
      fetchSlots(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete slot");
    }
  };

  // --- UPDATE LOGIC ---
  
  // 1. Initialise the edit form with the current slot's data
  const handleEdit = (slot) => {
    setIsEditing(slot._id);
    // Format the date for the date input field (YYYY-MM-DD)
    const formattedDate = new Date(slot.date).toISOString().split('T')[0];
    setEditDate(formattedDate);
    // Format the time strings (HH:MM)
    setEditStartTime(new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    setEditEndTime(new Date(slot.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  };

  // 2. Submit the update
  const submitUpdate = async (slotId) => {
    if (!editDate || !editStartTime || !editEndTime) {
      return alert("All update fields are required.");
    }

    try {
      // 🎯 Calls PUT /api/slots/:id
      await api.put(`/slots/${slotId}`, { 
        date: editDate,
        startTime: `${editDate}T${editStartTime}`, 
        endTime: `${editDate}T${editEndTime}`
      });
      

      alert("Slot updated successfully!");
      setIsEditing(null); // Exit editing mode
      fetchSlots(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update slot");
    }
  };

  // Helper to format date/time for display
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-lavender-50 via-mint-50 to-peach-50 py-10 px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-6 w-72 h-72 bg-lavender-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-8 w-96 h-96 bg-peach-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mint-200/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lavender-300 to-mint-300 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">🗓️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Host Dashboard</h1>
          <p className="text-gray-600">Manage your availability and keep your calendar tidy.</p>
        </div>

        {/* Add Slot Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-7 border border-white/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Add New Slot</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-mint-100 text-mint-700 font-semibold">
              {slots.length} total
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              className="w-full px-4 py-3 bg-white/60 border-2 border-lavender-100 rounded-xl placeholder-gray-400 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-lavender-300 hover:border-lavender-200 focus:bg-white"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
            <input
              type="time"
              className="w-full px-4 py-3 bg-white/60 border-2 border-mint-100 rounded-xl placeholder-gray-400 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-300 hover:border-mint-200 focus:bg-white"
              placeholder="Start Time"
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
            <input
              type="time"
              className="w-full px-4 py-3 bg-white/60 border-2 border-peach-100 rounded-xl placeholder-gray-400 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-peach-300 focus:border-peach-300 hover:border-peach-200 focus:bg-white"
              placeholder="End Time"
              onChange={(e) => setEndTime(e.target.value)}
              value={endTime}
            />
            <button
              onClick={addSlot}
              className="w-full h-full min-h-[52px] flex items-center justify-center rounded-xl bg-gradient-to-r from-lavender-400 via-mint-400 to-peach-400 text-white font-semibold shadow-lg shadow-lavender-200/50 hover:shadow-xl hover:shadow-lavender-300/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Slot
            </button>
          </div>
        </div>

        {/* Slots List Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-7 border border-white/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Scheduled Slots ({slots.length})
            </h2>
          </div>

          {slots.length === 0 ? (
            <p className="text-gray-500">You have no slots scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-4 border rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 ${
                    slot.isBooked ? 'border-peach-200' : 'border-lavender-200'
                  }`}
                >
                  {/* Slot Details Display */}
                  <div className="mb-3 md:mb-0">
                    <p className="font-bold text-gray-800">{formatDate(slot.date)}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          slot.isBooked
                            ? 'bg-peach-100 text-peach-700'
                            : 'bg-mint-100 text-mint-700'
                        }`}
                      >
                        {slot.isBooked ? 'BOOKED' : 'Available'}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons / Edit Form */}
                  {isEditing === slot._id ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <input 
                        type="date" 
                        value={editDate} 
                        onChange={(e) => setEditDate(e.target.value)} 
                        className="border-2 border-lavender-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lavender-300"
                      />
                      <input 
                        type="time" 
                        value={editStartTime} 
                        onChange={(e) => setEditStartTime(e.target.value)} 
                        className="border-2 border-mint-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mint-300"
                      />
                      <input 
                        type="time" 
                        value={editEndTime} 
                        onChange={(e) => setEditEndTime(e.target.value)} 
                        className="border-2 border-peach-100 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
                      />
                      <button 
                        onClick={() => submitUpdate(slot._id)} 
                        className="bg-gradient-to-r from-lavender-400 to-mint-400 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md transition"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setIsEditing(null)} 
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(slot)}
                        className="bg-lavender-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-lavender-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={slot.isBooked} // Cannot edit a booked slot
                      >
                        {slot.isBooked ? 'Booked' : 'Update'}
                      </button>
                      <button
                        onClick={() => deleteSlot(slot._id)}
                        className="bg-peach-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-peach-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={slot.isBooked} // Cannot delete a booked slot
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;