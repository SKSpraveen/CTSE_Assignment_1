const jwt = require("jsonwebtoken");

const protect = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    if (roles.length && !roles.includes(decoded.role))
      return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;

    if (typeof next === "function") {
      next();
    } else {
      console.warn("protect middleware invoked without a valid next() function");
    }
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;