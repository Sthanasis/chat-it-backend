const express = require("express");
const dotenv = require("dotenv");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

dotenv.config({
  path: "../.env",
});

const router = express.Router();

router.use(adminController.isAdmin);

router.get("/all", userController.getAllUsers);
router.get("/user/:uid", userController.getUserHandler);
router.patch("/", userController.updateUserStatus);

router.get("/search", userController.searchUsers);
router.get("/active", userController.getAllActiveUsers);

module.exports = router;
