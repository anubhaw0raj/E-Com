const express = require("express");
const { createOrder, getOrders, cancelOrder } = require("../controllers/orderController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate); // every order route requires a logged-in user

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
