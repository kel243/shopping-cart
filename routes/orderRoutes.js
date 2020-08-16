const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

const authController = require("../controllers/authController");

router.post("/order", orderController.postOrder);

router.post(
  "/admin/orders/:orderId",
  authController.isLoggedIn,
  orderController.completeOrder
);

module.exports = router;
