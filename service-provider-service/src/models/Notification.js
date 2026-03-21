const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema({
  providerId:    { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  userId:        { type: String, required: true },
  userName:      { type: String },
  appointmentId: { type: String },
  message:       { type: String, required: true },
  isRead:        { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notifSchema);