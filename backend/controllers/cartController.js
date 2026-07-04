const db = require("../db");

// Returns the user's cart joined with live product data
const fetchCart = async (userId) => {
  const { rows } = await db.query(
    `SELECT ci.product_id AS id, p.name, p.price::float8 AS price,
            p.images[1] AS image, p.stock, ci.quantity,
            c.name AS category
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     JOIN categories c ON c.id = p.category_id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at`,
    [userId]
  );
  return rows;
};

// GET /api/cart
const getCart = async (req, res) => {
  try {
    res.json(await fetchCart(req.user.id));
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart { productId, quantity }
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: "productId is required" });

  try {
    const product = await db.query("SELECT id, stock FROM products WHERE id = $1", [productId]);
    if (product.rowCount === 0) return res.status(404).json({ message: "Product not found" });
    if (product.rows[0].stock < 1) return res.status(409).json({ message: "Product is out of stock" });

    // Upsert, capping the quantity at available stock
    await db.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, LEAST($3::int, $4::int))
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, $4::int)`,
      [req.user.id, productId, Math.max(1, quantity), product.rows[0].stock]
    );

    res.status(201).json(await fetchCart(req.user.id));
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/cart/:productId { quantity } — set exact quantity, 0 removes
const updateCartItem = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const { quantity } = req.body;
  if (Number.isNaN(productId) || typeof quantity !== "number") {
    return res.status(400).json({ message: "Valid productId and quantity are required" });
  }

  try {
    if (quantity <= 0) {
      await db.query("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2", [req.user.id, productId]);
    } else {
      const result = await db.query(
        `UPDATE cart_items ci SET quantity = LEAST($3::int, p.stock)
         FROM products p
         WHERE ci.product_id = p.id AND ci.user_id = $1 AND ci.product_id = $2`,
        [req.user.id, productId, quantity]
      );
      if (result.rowCount === 0) return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(await fetchCart(req.user.id));
  } catch (err) {
    console.error("updateCartItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  if (Number.isNaN(productId)) return res.status(400).json({ message: "Invalid product id" });

  try {
    await db.query("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2", [req.user.id, productId]);
    res.json(await fetchCart(req.user.id));
  } catch (err) {
    console.error("removeFromCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart — empty the whole cart
const clearCart = async (req, res) => {
  try {
    await db.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    res.json([]);
  } catch (err) {
    console.error("clearCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
