import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/index.js";

// Initialize Prisma Client
const prisma = new PrismaClient();

interface RegisterRequest extends Request {
  body: {
    email: string;
    username: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

// Register new user
const register = async (req: RegisterRequest, res: Response): Promise<Response> => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingEmailUser = await prisma.users.findUnique({
      where: { email }
    });
    if (existingEmailUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUsernameUser = await prisma.users.findUnique({
      where: { username }
    });
    if (existingUsernameUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        email,
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        username: true
      }
    });

    return res.status(201).json({ 
      message: "User registered successfully",
      user: newUser
    });

  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: LoginRequest, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        password: true
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // return user info (id, username, email)
    return res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, username: user.username },
    });

  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user (frontend will handle clearing localStorage)
const logout = (req: Request, res: Response): Response => {
  return res.json({ message: "Logout successful" });
};

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return res.json(users);
  } catch (error: any) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cleanup function for Prisma client
const cleanup = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { register, login, logout, getAllUsers, cleanup };