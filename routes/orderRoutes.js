const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

router.post("/order", orderController.postOrder);

router.post("/admin/orders/:orderId", orderController.completeOrder);

module.exports = router;
