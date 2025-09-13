const products = require("../data/products");

// In-memory carts -> { userId: [cartItems] }
let carts = {};

// Helper to get cart for user
const getUserCart = (userId) => {
  if (!carts[userId]) carts[userId] = [];
  return carts[userId];
};

// Get all cart items for a user
const getCart = (req, res) => {
  const { userId } = req.query; // client must send ?userId=...
  if (!userId) return res.status(400).json({ message: "User ID required" });

  const cart = getUserCart(userId);
  res.json(cart);
};

// Add product to cart
const addToCart = (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId) return res.status(400).json({ message: "User ID required" });

  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cart = getUserCart(userId);

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.push({ ...product, quantity: quantity || 1 });
  }

  res.json(cart);
};

//  Decrease Update quantity
const updateCartItem = (req, res) => {
  const { userId, quantity } = req.body;
  const itemId = parseInt(req.params.id);

  if (!userId) return res.status(400).json({ message: "User ID required" });

  const cart = getUserCart(userId);
  const item = cart.find((i) => i.id === itemId);

  if (!item) return res.status(404).json({ message: "Cart item not found" });

  if (quantity <= 0) {
    carts[userId] = cart.filter((i) => i.id !== itemId);
  } else {
    item.quantity = quantity;
  }

  res.json(carts[userId]);
};

// Remove product
const removeFromCart = (req, res) => {
  const { userId } = req.query;   // get userId from query
  const itemId = parseInt(req.params.id);

  if (!userId) return res.status(400).json({ message: "User ID required" });

  const cart = getUserCart(userId);
  carts[userId] = cart.filter((i) => i.id !== itemId);

  res.json(carts[userId]);
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
