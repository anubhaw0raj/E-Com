const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./initDatabase");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) =>{
  res.send("Welcome to the E-commerce API");
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/auth", authRoutes); 

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    
    if (dbInitialized) {
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
      });
    } else {
      console.log('⚠️  Server starting without database connection');
      console.log('💡 User data will be stored in memory only');
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT} (No Database)`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
