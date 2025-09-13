const products = require("../data/products");

// In-memory cart (later replace with DB)
let cart = [];

// Get all cart items
const getCart = (req, res) => {
  res.json(cart);
};

// Add product to cart
const addToCart = (req, res) => {
  const { productId, quantity } = req.body;

  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.push({ ...product, quantity: quantity || 1 });
  }

  res.json(cart);
};

// Update quantity
const updateCartItem = (req, res) => {
  const itemId = parseInt(req.params.id);
  const { quantity } = req.body;

  const item = cart.find(item => item.id === itemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  if (quantity <= 0) {
    cart = cart.filter(i => i.id !== itemId);
  } else {
    item.quantity = quantity;
  }

  res.json(cart);
};

// Remove product
const removeFromCart = (req, res) => {
  const itemId = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== itemId);
  res.json(cart);
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };