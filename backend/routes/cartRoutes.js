const express = require("express");
const { getCart, addToCart, updateCartItem, removeFromCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);          // GET all cart items
router.post("/", addToCart);       // Add to cart
router.put("/:id", updateCartItem); // Update quantity
router.delete("/:id", removeFromCart); // Remove from cart

module.exports = router;