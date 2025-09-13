// routes/checkoutRoutes.js
const express = require("express");
const { cancelOrder, checkout, getOrders } = require("../controllers/checkoutController");

const router = express.Router();

// All routes require userId
router.post("/", checkout);                // Place an order (userId in body)
router.get("/", getOrders);                // Get all orders for user (userId in query)
router.delete("/:id", cancelOrder);        // Cancel an order (userId in query)

module.exports = router;
