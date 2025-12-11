import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBooked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Slot", slotSchema);
