const router   = require("express").Router();
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const Provider = require("../models/Provider");
const Notif    = require("../models/Notification");
const protect  = require("../middleware/auth");

// POST /api/providers/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, specialty, phone } = req.body;
    if (await Provider.findOne({ email }))
      return res.status(409).json({ message: "Email already registered" });
    const provider = await Provider.create({ name, email, password, specialty, phone });
    res.status(201).json({ message: "Registered. Await admin activation.", provider });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/providers/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await Provider.findOne({ email });
    if (!provider || !(await bcrypt.compare(password, provider.password)))
      return res.status(401).json({ message: "Invalid credentials" });
    if (!provider.isActive)
      return res.status(403).json({ message: "Account not activated by admin" });

    const token = jwt.sign(
      { id: provider._id, email: provider.email, role: "provider" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, provider });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/providers/profile
router.get("/profile", protect(["provider"]), async (req, res) => {
  const p = await Provider.findById(req.user.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// PUT /api/providers/profile  — also update availability slots
router.put("/profile", protect(["provider"]), async (req, res) => {
  try {
    const { name, phone, specialty, availability } = req.body;

    // sanitize availability entries: remove any custom _id or convert to ObjectId
    let updateFields = { name, phone, specialty };
    if (Array.isArray(availability)) {
      // ignore any _id values from client (they often send strings); let mongoose generate ids
      const slots = availability.map(s => ({
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        isBooked: s.isBooked,
      }));
      updateFields.availability = slots;
    }

    const p = await Provider.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );
    res.json(p);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/providers/notifications
router.get("/notifications", protect(["provider"]), async (req, res) => {
  const notifs = await Notif.find({ providerId: req.user.id }).sort({ createdAt: -1 });
  res.json(notifs);
});

// PUT /api/providers/notifications/:id/read
router.put("/notifications/:id/read", protect(["provider"]), async (req, res) => {
  const n = await Notif.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json(n);
});

// GET /api/providers/all  — internal / admin use
router.get("/all", protect(["admin", "user", "provider"]), async (req, res) => {
  const providers = await Provider.find({ isActive: true }).select("-password");
  res.json(providers);
});

// GET /api/providers/:id  — internal use
router.get("/:id", protect(["admin", "user", "provider", "appointment-service"]), async (req, res) => {
  const p = await Provider.findById(req.params.id).select("-password");
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// POST /api/providers/notify  — called by Appointment Service after booking
router.post("/notify", protect(["admin", "user"]), async (req, res) => {
  try {
    const { providerId, userId, userName, appointmentId, message } = req.body;
    const notif = await Notif.create({ providerId, userId, userName, appointmentId, message });
    res.status(201).json(notif);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/providers/:id/admin-activate  — called by Admin Service
router.put("/:id/admin-activate", protect(["admin"]), async (req, res) => {
  const p = await Provider.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
  res.json({ message: "Provider activated", provider: p });
});

// PUT /api/providers/:id/admin-deactivate
router.put("/:id/admin-deactivate", protect(["admin"]), async (req, res) => {
  const p = await Provider.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  res.json({ message: "Provider deactivated", provider: p });
});

// DELETE /api/providers/:id  — called by Admin Service
router.delete("/:id", protect(["admin"]), async (req, res) => {
  await Provider.findByIdAndDelete(req.params.id);
  res.json({ message: "Provider deleted" });
});

// Mark slot as booked — called internally by Appointment Service
router.put("/:id/slots/:slotId/book", protect(["admin", "user"]), async (req, res) => {
  try {
    const p = await Provider.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Provider not found" });
    const slot = p.availability.id(req.params.slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(409).json({ message: "Slot already booked" });
    slot.isBooked = true;
    await p.save();
    res.json({ message: "Slot booked", slot });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;