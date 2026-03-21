const router  = require("express").Router();
const User    = require("../models/User");
const protect = require("../middleware/auth");

// GET /api/users/profile  — own profile
router.get("/profile", protect(), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/users/profile  — update own profile
router.put("/profile", protect(), async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.json(user);
});

// GET /api/users/status  — own verification status
router.get("/status", protect(), async (req, res) => {
  const user = await User.findById(req.user.id).select("isVerified isActive");
  res.json(user);
});

// GET /api/users/all  — admin or internal use
router.get("/all", protect(["admin"]), async (req, res) => {
  const users = await User.find({ role: "user" });
  res.json(users);
});

// GET /api/users/:id  — internal use by other services
router.get("/:id", protect(["admin", "provider", "user"]), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/users/:id/admin-verify — called by Admin Service to mark verified
router.put("/:id/admin-verify", protect(["admin"]), async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User verified", user: u });
});

// PUT /api/users/:id/admin-deactivate — called by Admin Service to disable account
router.put("/:id/admin-deactivate", protect(["admin"]), async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deactivated", user: u });
});

module.exports = router;