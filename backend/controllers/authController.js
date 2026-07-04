const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const publicUser = (u) => ({
  id: u.id,
  username: u.username,
  email: u.email,
  fullName: u.full_name,
  role: u.role,
  createdAt: u.created_at,
});

// POST /api/auth/register
const register = async (req, res) => {
  const { email, username, password, fullName } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Email, username and password are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const exists = await db.query(
      "SELECT email, username FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (exists.rowCount > 0) {
      const row = exists.rows[0];
      const message = row.email === email ? "Email already registered" : "Username already taken";
      return res.status(409).json({ message });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const insert = await db.query(
      `INSERT INTO users (email, username, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, full_name, role, created_at`,
      [email, username, passwordHash, fullName || null]
    );

    const user = insert.rows[0];
    return res.status(201).json({
      message: "User registered successfully",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email or username already exists" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login — accepts username OR email as identifier
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      `SELECT id, email, username, full_name, role, password_hash, created_at
       FROM users WHERE username = $1 OR email = $1`,
      [username]
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Login successful",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me — current user profile with order/cart stats
const me = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.username, u.full_name, u.role, u.created_at,
              (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id)::int AS order_count,
              (SELECT COALESCE(SUM(ci.quantity), 0) FROM cart_items ci WHERE ci.user_id = u.id)::int AS cart_count
       FROM users u WHERE u.id = $1`,
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const u = result.rows[0];
    return res.json({ ...publicUser(u), orderCount: u.order_count, cartCount: u.cart_count });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, me };
