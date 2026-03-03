const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  userName:   { type: String },
  providerId: { type: String, required: true },
  slotId:     { type: String, required: true },
  date:       { type: String, required: true },
  startTime:  { type: String, required: true },
  endTime:    { type: String, required: true },
  status:     { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
  notes:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);