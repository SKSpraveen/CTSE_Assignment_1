const axios = require("axios");
const jwt   = require("jsonwebtoken");

// Create a short-lived internal token for service-to-service calls
const internalToken = () =>
  jwt.sign({ id: "admin-service", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1m" });

const userClient = () =>
  axios.create({
    baseURL: process.env.USER_SERVICE_URL,
    headers: { Authorization: `Bearer ${internalToken()}` },
  });

const providerClient = () =>
  axios.create({
    baseURL: process.env.PROVIDER_SERVICE_URL,
    headers: { Authorization: `Bearer ${internalToken()}` },
  });

module.exports = { userClient, providerClient };