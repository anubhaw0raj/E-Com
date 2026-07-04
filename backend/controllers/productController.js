const db = require("../db");

// Shared SELECT that shapes a product row the way the frontend expects
const PRODUCT_SELECT = `
  SELECT p.id, p.name, c.name AS category, c.slug AS category_slug,
         p.price::float8 AS price, p.rating::float8 AS rating,
         p.description, p.images, p.about, p.specs, p.stock
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

// GET /api/products?category=&search=&sort=
const getProducts = async (req, res) => {
  const { category, search, sort } = req.query;
  const conditions = [];
  const params = [];

  if (category && category.toLowerCase() !== "all") {
    params.push(category.toLowerCase());
    conditions.push(`(LOWER(c.name) = $${params.length} OR c.slug = $${params.length})`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }

  const orderBy =
    sort === "price_asc" ? "p.price ASC" :
    sort === "price_desc" ? "p.price DESC" :
    sort === "rating" ? "p.rating DESC" :
    "p.id ASC";

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const { rows } = await db.query(`${PRODUCT_SELECT} ${where} ORDER BY ${orderBy}`, params);
    res.json(rows);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT id, name, slug FROM categories ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid product id" });

  try {
    const { rows, rowCount } = await db.query(`${PRODUCT_SELECT} WHERE p.id = $1`, [id]);
    if (rowCount === 0) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProducts, getProductById, getCategories };
