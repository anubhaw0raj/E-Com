const db = require("../db");

// GET /api/products/:id/reviews (public)
const getReviews = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  if (Number.isNaN(productId)) return res.status(400).json({ message: "Invalid product id" });

  try {
    const { rows } = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.username
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );
    res.json(rows);
  } catch (err) {
    console.error("getReviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products/:id/reviews (auth) — upserts the user's review and
// recalculates the product's aggregate rating.
const addReview = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { rating, comment } = req.body;

  if (Number.isNaN(productId)) return res.status(400).json({ message: "Invalid product id" });
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const product = await client.query("SELECT id FROM products WHERE id = $1", [productId]);
    if (product.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    await client.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, user_id)
       DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = NOW()`,
      [productId, req.user.id, rating, comment || null]
    );

    await client.query(
      `UPDATE products
       SET rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1)
       WHERE id = $1`,
      [productId]
    );

    await client.query("COMMIT");

    const { rows } = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.username
       FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
      [productId]
    );
    res.status(201).json(rows);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("addReview error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = { getReviews, addReview };
