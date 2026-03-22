const express  = require("express");
const helmet   = require("helmet");
const cors     = require("cors");
const morgan   = require("morgan");
require("dotenv").config();
const connectDB       = require("./src/config/db");
const providerRoutes  = require("./src/routes/provider");

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/providers", providerRoutes);
app.get("/health", (_, res) => res.json({ status: "provider-service ok" }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

app.listen(process.env.PORT || 3004, () =>
  console.log(`Provider Service on port ${process.env.PORT || 3004}`)
);