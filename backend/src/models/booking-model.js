import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", unique: true },
  name: String,
  email: String,
  purpose: String
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
