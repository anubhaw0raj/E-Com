import express, { Router } from "express";
import { register, login, logout, getAllUsers } from "../controllers/authController";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Debug route
router.get("/users", getAllUsers);

export default router;