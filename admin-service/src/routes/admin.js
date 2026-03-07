const router  = require("express").Router();
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const Admin   = require("../models/Admin");
const protect = require("../middleware/auth");
const { userClient, providerClient } = require("../config/serviceClients");

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, admin });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── User Management ─────────────────────────────────────────────

// GET /api/admin/users  — fetch from User Service
router.get("/users", protect(["admin"]), async (req, res) => {
  try {
    const { data } = await userClient().get("/api/users/all");
    res.json(data);
  } catch (e) { res.status(502).json({ message: "User service error", detail: e.message }); }
});

// PUT /api/admin/users/:id/verify
router.put("/users/:id/verify", protect(["admin"]), async (req, res) => {
  try {
    // Admin service calls User Service to update the user directly via DB is not recommended;
    // Instead User Service exposes an internal endpoint. Here we simulate via a PATCH-style call.
    // For this project we expose a special admin endpoint in user-service:
    const { data } = await userClient().put(`/api/users/${req.params.id}/admin-verify`);
    res.json(data);
  } catch (e) { res.status(502).json({ message: e.message }); }
});

// PUT /api/admin/users/:id/deactivate
router.put("/users/:id/deactivate", protect(["admin"]), async (req, res) => {
  try {
    const { data } = await userClient().put(`/api/users/${req.params.id}/admin-deactivate`);
    res.json(data);
  } catch (e) { res.status(502).json({ message: e.message }); }
});

// ── Provider Management ─────────────────────────────────────────

// GET /api/admin/providers
router.get("/providers", protect(["admin"]), async (req, res) => {
  try {
    const { data } = await providerClient().get("/api/providers/all");
    res.json(data);
  } catch (e) { res.status(502).json({ message: e.message }); }
});

// PUT /api/admin/providers/:id/activate
router.put("/providers/:id/activate", protect(["admin"]), async (req, res) => {
  try {
    const { data } = await providerClient().put(`/api/providers/${req.params.id}/admin-activate`);
    res.json(data);
  } catch (e) { res.status(502).json({ message: e.message }); }
});

// PUT /api/admin/providers/:id/deactivate
router.put("/providers/:id/deactivate", protect(["admin"]), async (req, res) => {
  try {
    const { data } = await providerClient().put(`/api/providers/${req.params.id}/admin-deactivate`);
    res.json(data);
  } catch (e) { res.status(502).json({ message: e.message }); }
});

// DELETE /api/admin/providers/:id
router.delete("/providers/:id", protect(["admin"]), async (req, res) => {
  try {
    const { data } = await providerClient().delete(`/api/providers/${req.params.id}`);
    res.json(data);
  } catch (e) { res.status(502).json({ message: e.message }); }
});

module.exports = router;