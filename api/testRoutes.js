const express = require("express");
const dotenv = require("dotenv");
const userController = require("../controllers/userController");

dotenv.config({
    path: "../.env",
});

const router = express.Router();

router.get("/all", userController.getAllUsers);

module.exports = router;
