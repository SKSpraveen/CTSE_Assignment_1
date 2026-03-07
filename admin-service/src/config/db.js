const mongoose = require("mongoose");
const Admin = require("../models/Admin");

module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Admin DB connected");

  // create a default admin if credentials provided and none exist
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    try {
      const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
      if (!existing) {
        console.log("Creating default admin user");
        await Admin.create({
          name: "Administrator",
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        });
      }
    } catch (e) {
      console.error("Error seeding admin:", e.message);
    }
  }
};