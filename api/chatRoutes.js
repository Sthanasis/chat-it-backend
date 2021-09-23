const express = require("express");
const dotenv = require("dotenv");
const adminController = require("../controllers/adminController");
const chatController = require("../controllers/chatController");

dotenv.config({
  path: "../.env",
});

const router = express.Router();

router.use(adminController.isAdmin);

router.get("/", chatController.getChat);
router.post("/", chatController.postChat);

module.exports = router;
