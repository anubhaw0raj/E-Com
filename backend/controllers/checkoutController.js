// controllers/checkoutController.js
// Dictionary to store user-specific orders
let orders = {}; // {userId: [orders]}
let orderIdCounter = 1;

// Helper to get orders for user
const getUserOrders = (userId) => {
  if (!orders[userId]) orders[userId] = [];
  return orders[userId];
};

// Confirm checkout and create new order
const checkout = (req, res) => {
  const { userId, cartItems, address, paymentMethod } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const newOrder = {
    id: orderIdCounter++,
    userId,
    items: cartItems,
    address: address || "Default Address",
    paymentMethod: paymentMethod || "COD",
    status: "Pending",
    date: new Date().toISOString(),
  };

  getUserOrders(userId).push(newOrder);

  return res.status(201).json({
    message: "Order placed successfully",
    order: newOrder,
  });
};


// Cancel order
const cancelOrder = (req, res) => {
  const { userId } = req.query;
  const orderId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  const userOrders = getUserOrders(userId);
  const index = userOrders.findIndex((o) => o.id === orderId);

  if (index === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  userOrders.splice(index, 1);
  res.json({ message: "Order cancelled successfully", orderId });
};

// Get all orders for a user
const getOrders = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  res.json(getUserOrders(userId));
};

module.exports = { checkout, getOrders, cancelOrder };