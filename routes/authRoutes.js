const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.alreadyLoggedIn, authController.postLogin);

module.exports = router;
