const router      = require("express").Router();
const Appointment = require("../models/Appointment");
const protect     = require("../middleware/auth");
const { userClient, providerClient } = require("../config/serviceClients");

// ── GET /api/appointments/providers
// Fetch all active providers from Provider Service
router.get("/providers", protect(["user", "admin"]), async (req, res) => {
  try {
    const { data } = await providerClient().get("/api/providers/all");
    res.json(data);
  } catch (e) { res.status(502).json({ message: "Provider service error", detail: e.message }); }
});

// ── GET /api/appointments/providers/:id/availability
// Check availability of a specific provider
router.get("/providers/:id/availability", protect(["user", "admin"]), async (req, res) => {
  try {
    const { data: provider } = await providerClient().get(`/api/providers/${req.params.id}`);
    if (!provider.isActive)
      return res.status(404).json({ message: "Provider not active" });

    // Return only unbooked slots
    const freeSlots = provider.availability.filter(s => !s.isBooked);
    res.json({ providerId: provider._id, name: provider.name, specialty: provider.specialty, freeSlots });
  } catch (e) { res.status(502).json({ message: "Provider service error", detail: e.message }); }
});

// ── POST /api/appointments/book
// Book an appointment — the core inter-service workflow
router.post("/book", protect(["user"]), async (req, res) => {
  try {
    const { providerId, slotId, notes } = req.body;

    // 1. Verify user is verified (call User Service)
    const { data: user } = await userClient().get(`/api/users/${req.user.id}`);
    if (!user.isVerified)
      return res.status(403).json({ message: "Your account must be verified before booking" });
    if (!user.isActive)
      return res.status(403).json({ message: "Account is deactivated" });

    // 2. Fetch provider + check slot availability (call Provider Service)
    const { data: provider } = await providerClient().get(`/api/providers/${providerId}`);
    if (!provider.isActive)
      return res.status(404).json({ message: "Provider not active" });

    const slot = provider.availability.find(s => s._id === slotId || s._id?.toString() === slotId);
    if (!slot)
      return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked)
      return res.status(409).json({ message: "Slot already booked" });

    // 3. Mark slot as booked in Provider Service
    await providerClient().put(`/api/providers/${providerId}/slots/${slotId}/book`);

    // 4. Create appointment record in own DB
    const appt = await Appointment.create({
      userId:    req.user.id,
      userName:  user.name,
      providerId,
      slotId,
      date:      slot.date,
      startTime: slot.startTime,
      endTime:   slot.endTime,
      notes,
    });

    // 5. Send notification to Provider Service
    await providerClient().post("/api/providers/notify", {
      providerId,
      userId:        req.user.id,
      userName:      user.name,
      appointmentId: appt._id.toString(),
      message:       `New appointment booked by ${user.name} on ${slot.date} at ${slot.startTime}`,
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment: appt });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/appointments/my  — own appointments
router.get("/my", protect(["user"]), async (req, res) => {
  const appts = await Appointment.find({ userId: req.user.id }).sort({ date: 1 });
  res.json(appts);
});

// ── PUT /api/appointments/:id/cancel
router.put("/:id/cancel", protect(["user"]), async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user.id });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (appt.status === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    appt.status = "cancelled";
    await appt.save();
    res.json({ message: "Appointment cancelled", appointment: appt });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/appointments/all  — admin
router.get("/all", protect(["admin"]), async (req, res) => {
  const appts = await Appointment.find().sort({ createdAt: -1 });
  res.json(appts);
});

// ── GET /api/appointments/:id
router.get("/:id", protect(["user", "admin"]), async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Not found" });
  res.json(appt);
});

module.exports = router;