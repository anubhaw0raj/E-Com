import express, { Router } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController";

const router: Router = express.Router();

router.get("/", getCart);          // GET all cart items
router.post("/", addToCart);       // Add to cart
router.put("/:id", updateCartItem); // Update quantity
router.delete("/:id", removeFromCart); // Remove from cart
router.delete("/", clearCart);     // Clear entire cart

export default router;