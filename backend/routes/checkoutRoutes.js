// routes/checkoutRoutes.js
const express = require("express");
const { cancelOrder, checkout, getOrders } = require("../controllers/checkoutController");

const router = express.Router();

router.post("/", checkout);    // Place an order
router.get("/", getOrders);    // Get all orders
router.delete("/:id", cancelOrder);  // Cancel an order

module.exports = router;
