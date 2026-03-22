const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const slotSchema = new mongoose.Schema({
  date:      { type: String, required: true },  // "YYYY-MM-DD"
  startTime: { type: String, required: true },  // "HH:MM"
  endTime:   { type: String, required: true },
  isBooked:  { type: Boolean, default: false },
});

const providerSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  specialty:    { type: String, required: true },
  phone:        { type: String },
  role:         { type: String, default: "provider" },
  isActive:     { type: Boolean, default: false }, // activated by Admin
  availability: [slotSchema],
}, { timestamps: true });

// hash password before saving (async hook without next)
providerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await require("bcryptjs").hash(this.password, 12);
});

providerSchema.methods.toJSON = function () {
  const o = this.toObject(); delete o.password; return o;
};

module.exports = mongoose.model("Provider", providerSchema);