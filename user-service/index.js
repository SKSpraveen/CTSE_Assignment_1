const express  = require("express");
const helmet   = require("helmet");
const cors     = require("cors");
const morgan   = require("morgan");
require("dotenv").config();
const connectDB  = require("./src/config/db");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_, res) => res.json({ status: "user-service ok" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT || 3001, () =>
  console.log(`User Service running on port ${process.env.PORT || 3001}`)
);