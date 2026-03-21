const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, default: "admin" },
}, { timestamps: true });

// hash password before saving (async hook without next)
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.matchPassword = (plain, hash) => require("bcryptjs").compare(plain, hash);

adminSchema.methods.toJSON = function () {
  const o = this.toObject(); delete o.password; return o;
};

module.exports = mongoose.model("Admin", adminSchema);