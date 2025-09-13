// In-memory user storage for now
// library -> bcryptjs

// Register new user (POST /api/auth/register) -> username, email, password frontend se
// check if user exists -> return error -> login page 
// { userId, userName, email, hashed_password }
// iska jo function bnega usme jo password aayega usko tmkio hash krna hoga
// api response -> jo naya user banega {id, userName, email} -> if you want to directly go to home
// api response -> success message -> login page redirect krdo


// Login user (POST /api/auth/login) -> username, password
// check if user exists -> if no0 > return error and ask user to register
// password received -> usko hash kro aur compare kro already wala 
// match kr gya  -> api response -> {id, userName, email} 
// nhi match kiya to error message bhejo -> login failed

// [NOT NECESSARY] - Logout user (POST /api/auth/logout) -> username
// backend api banane ka jroorat nhi hai
// logout frontend me jo button hoga wo bs localStorage se user object hata 


// controllers/authController.js
const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");
let userIdCounter = 1; // Simple counter for user IDs

// Register new user
const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const usernameCheck = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const result = await pool.query(
      "INSERT INTO users (id, email, username, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username",
      [userIdCounter, email, username, hashedPassword, new Date()]
    );

    userIdCounter++; // Increment user ID counter for next user

    return res.status(201).json({ 
      message: "User registered successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login user (by username + password)
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const result = await pool.query(
      "SELECT id, email, username, password FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // return user info (id, username, email)
    return res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, username: user.username },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user (frontend will handle clearing localStorage)
const logout = (req, res) => {
  return res.json({ message: "Logout successful" });
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, username, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout, getAllUsers };
