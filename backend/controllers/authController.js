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

let users = []; // in-memory users list
let userIdCounter = 1;

// Register new user
const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email already exists
  const existingEmail = users.find((u) => u.email === email);
  if (existingEmail) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Check if username already exists
  const existingUsername = users.find((u) => u.username === username);
  if (existingUsername) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: userIdCounter++,
    email,
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully" });
};

// Login user (by username + password)
const login = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // return user info (id, username, email)
  return res.json({
    message: "Login successful",
    user: { id: user.id, email: user.email, username: user.username },
  });
};

// Logout user (frontend will handle clearing localStorage)
const logout = (req, res) => {
  return res.json({ message: "Logout successful" });
};

const getAllUsers = (req, res) => {
  res.json(users);
};

module.exports = { register, login, logout, getAllUsers };
