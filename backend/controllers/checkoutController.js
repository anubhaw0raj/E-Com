// controllers/checkoutController.js
let orders = []; // in-memory orders for now
let orderIdCounter = 1;

// Confirm checkout and create new order
const checkout = (req, res) => {
  const { cartItems, address, paymentMethod } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const newOrder = {
    id: orderIdCounter++,
    items: cartItems,
    address: address || "Default Address",
    paymentMethod: paymentMethod || "COD",
    status: "Pending",
    date: new Date().toISOString(),
  };

  orders.push(newOrder);

  return res.status(201).json({
    message: "Order placed successfully",
    order: newOrder,
  });
};


// Cancel order
const cancelOrder = (req, res) => {
  const orderId = parseInt(req.params.id);
  const index = orders.findIndex((o) => o.id === orderId);

  if (index === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  orders.splice(index, 1);
  res.json({ message: "Order cancelled successfully", orderId });
};


// Get all orders
const getOrders = (req, res) => {
  res.json(orders);
};

module.exports = { checkout, getOrders, cancelOrder };