import express, { Router } from "express";
import { cancelOrder, checkout, getOrders, getOrderById, updateOrderStatus } from "../controllers/checkoutController";

const router: Router = express.Router();

// All routes require userId
router.post("/", checkout);                // Place an order (userId in body)
router.get("/", getOrders);                // Get all orders for user (userId in query)
router.get("/:id", getOrderById);          // Get specific order by ID (userId in query)
router.put("/:id/status", updateOrderStatus); // Update order status
router.delete("/:id", cancelOrder);        // Cancel an order (userId in query)

export default router;