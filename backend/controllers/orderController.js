const db = require("../db");

const TAX_RATE = 0.08;
const DELIVERY_FEE = 10;

// Loads full orders (with line items) for a user, newest first
const fetchOrders = async (userId) => {
  const { rows } = await db.query(
    `SELECT o.id, o.status, o.shipping_address AS address, o.payment_method,
            o.subtotal::float8 AS subtotal, o.tax::float8 AS tax,
            o.delivery_fee::float8 AS delivery_fee, o.total::float8 AS total,
            o.created_at,
            COALESCE(json_agg(json_build_object(
              'id', oi.product_id,
              'name', oi.product_name,
              'price', oi.unit_price::float8,
              'quantity', oi.quantity,
              'image', oi.image
            ) ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
};

// POST /api/orders — checkout: builds the order from the user's DB cart,
// decrements stock and clears the cart, all in one transaction.
const createOrder = async (req, res) => {
  const { address, paymentMethod } = req.body;
  if (!address || !paymentMethod) {
    return res.status(400).json({ message: "Address and payment method are required" });
  }

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const cart = await client.query(
      `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock, p.images[1] AS image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       FOR UPDATE OF p`,
      [req.user.id]
    );

    if (cart.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.rows) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          message: `Not enough stock for "${item.name}" (only ${item.stock} left)`,
        });
      }
    }

    const subtotal = cart.rows.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + DELIVERY_FEE;

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, shipping_address, payment_method, subtotal, tax, delivery_fee, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [req.user.id, address, paymentMethod, subtotal.toFixed(2), tax.toFixed(2), DELIVERY_FEE, total.toFixed(2)]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of cart.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.name, item.price, item.quantity, item.image]
      );
      await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.product_id]);
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    await client.query("COMMIT");

    const orders = await fetchOrders(req.user.id);
    return res.status(201).json({
      message: "Order placed successfully",
      order: orders.find((o) => o.id === orderId),
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    res.json(await fetchOrders(req.user.id));
  } catch (err) {
    console.error("getOrders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/orders/:id/cancel — only pending orders; restores stock
const cancelOrder = async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  if (Number.isNaN(orderId)) return res.status(400).json({ message: "Invalid order id" });

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const order = await client.query(
      "SELECT id, status FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [orderId, req.user.id]
    );
    if (order.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.rows[0].status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: `Cannot cancel a ${order.rows[0].status} order` });
    }

    await client.query(
      `UPDATE products p SET stock = p.stock + oi.quantity
       FROM order_items oi
       WHERE oi.order_id = $1 AND oi.product_id = p.id`,
      [orderId]
    );
    await client.query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [orderId]);

    await client.query("COMMIT");
    res.json({ message: "Order cancelled successfully", orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("cancelOrder error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = { createOrder, getOrders, cancelOrder };
