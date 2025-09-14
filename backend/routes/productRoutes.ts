import express, { Router } from "express";
import { getProducts, getProductById, getCategories } from "../controllers/productController";

const router: Router = express.Router();

router.get("/", getProducts);         // GET /api/products
router.get("/categories", getCategories); // GET /api/products/categories
router.get("/:id", getProductById);   // GET /api/products/:id

export default router;