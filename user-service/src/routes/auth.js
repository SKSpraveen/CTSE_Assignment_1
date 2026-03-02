const router     = require("express").Router();
const { body, validationResult } = require("express-validator");
const jwt        = require("jsonwebtoken");
const User       = require("../models/User");

// helper for returning validation errors
const sendValidation = (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    res.status(422).json({ errors: errs.array() });
    return true;
  }
  return false;
};

// POST /api/users/register
router.post("/register",
  [
    body("name").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    if (sendValidation(req, res)) return;

    try {
      const { name, email, password, phone } = req.body;
      if (await User.findOne({ email }))
        return res.status(409).json({ message: "Email already registered" });

      const user = await User.create({ name, email, password, phone });
      res.status(201).json({ message: "Registered successfully. Await verification.", user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }
);

// POST /api/users/login
router.post("/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    if (sendValidation(req, res)) return;

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: "Invalid credentials" });
      if (!user.isActive)
        return res.status(403).json({ message: "Account deactivated" });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({ token, user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;