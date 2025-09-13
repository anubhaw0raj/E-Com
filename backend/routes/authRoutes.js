// routes for auth controlelr// routes/authRoutes.js
const express = require("express");
const { register, login, logout, getAllUsers } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Debug route
router.get("/users", getAllUsers);

module.exports = router;