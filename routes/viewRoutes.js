const express = require("express");

const router = express.Router();

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

router.get("/", viewsController.getIndex);

router.get("/login", viewsController.getLogin);

router.get("/admin", authController.protect, viewsController.getAdmin);

module.exports = router;
