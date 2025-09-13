const express = require("express");
const { getProducts, getProductById } = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);       // GET /api/products
router.get("/:id", getProductById); // GET /api/products/:id

module.exports = router;