import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { initializeDatabase, cleanup } from "./config/database";

import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import authRoutes from "./routes/authRoutes";

const app: Express = express();
const PORT: number = 5000;
const envFile = `.env.${process.env.NODE_ENV || "local"}`;
dotenv.config({ path: envFile });
dotenv.config(); // Load .env as fallback

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to the E-commerce API");
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/auth", authRoutes); 

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await cleanup();
  process.exit(0);
});

// Initialize database and start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connections
    const dbInitialized: boolean = await initializeDatabase();
    
    if (dbInitialized) {
      app.listen(PORT, (): void => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log('📊 Using Prisma ORM for database operations');
      });
    } else {
      console.log('⚠️  Database connection failed');
      console.log('❌ Server cannot start without database connection');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();