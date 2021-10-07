const express = require("express");
const dotenv = require("dotenv");
const adminController = require("../controllers/adminController");

dotenv.config({
  path: "../.env",
});

const router = express.Router();

router.post("/login", adminController.login);
router.post("/register", adminController.signUp);

module.exports = router;
