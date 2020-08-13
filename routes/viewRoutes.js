const express = require("express");

const router = express.Router();

const viewsController = require("../controllers/viewsController");

router.get("/", viewsController.getIndex);

router.get("/login", viewsController.getLogin);

module.exports = router;
