const express = require("express");

const router = express.Router();

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

router.get("/", authController.isLoggedIn, viewsController.getIndex);

router.get("/login", authController.alreadyLoggedIn, viewsController.getLogin);

router.get("/admin", authController.protect, viewsController.getAdmin);

router.get(
  "/admin/products",
  authController.protect,
  viewsController.getAdminProducts
);

router.get(
  "/admin/products/reg/:itemId",
  authController.protect,
  viewsController.getAdminRegProduct
);

router.get(
  "/admin/products/spec/:itemId",
  authController.protect,
  viewsController.getAdminSpecProduct
);

router.get(
  "/admin/orders",
  authController.protect,
  viewsController.getAdminOrders
);

module.exports = router;
