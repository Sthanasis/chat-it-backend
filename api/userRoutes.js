const express = require("express");
const dotenv = require("dotenv");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

dotenv.config({
  path: "../.env",
});

const router = express.Router();

router.use(adminController.isAdmin);

router.get("/", userController.getAllUsers);

module.exports = router;
