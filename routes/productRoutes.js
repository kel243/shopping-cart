const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

router.post("/admin/products/reg/:itemId", productController.postRegItem);

router.post("/admin/products/spec/:itemId", productController.postSpecItem);

module.exports = router;
