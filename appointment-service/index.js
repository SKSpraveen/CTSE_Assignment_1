const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");
const morgan  = require("morgan");
require("dotenv").config();
const connectDB          = require("./src/config/db");
const appointmentRoutes  = require("./src/routes/appointment");

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);
app.get("/health", (_, res) => res.json({ status: "appointment-service ok" }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

app.listen(process.env.PORT || 3003, () =>
  console.log(`Appointment Service on port ${process.env.PORT || 3003}`)
);