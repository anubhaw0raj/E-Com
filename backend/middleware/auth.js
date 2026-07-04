const jwt = require("jsonwebtoken");

// Verifies the "Authorization: Bearer <token>" header and puts the decoded
// user ({ id, username }) on req.user. All cart/order/review routes use this.
const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticate };
