const axios = require("axios");
const jwt   = require("jsonwebtoken");

const internalToken = () =>
  jwt.sign({ id: "appointment-service", role: "user" }, process.env.JWT_SECRET, { expiresIn: "1m" });

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