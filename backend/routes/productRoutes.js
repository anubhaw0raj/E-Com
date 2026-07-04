const express = require("express");
const { getProducts, getProductById, getCategories } = require("../controllers/productController");
const { getReviews, addReview } = require("../controllers/reviewController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories); // must come before /:id
router.get("/:id", getProductById);
router.get("/:id/reviews", getReviews);
router.post("/:id/reviews", authenticate, addReview);

module.exports = router;
