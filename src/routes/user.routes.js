const express = require("express");
const router = express.Router();
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const { ADMIN } = require('../config/config.json').role

// Only admin can create and manage users
router.get("/", auth, roleAuth(ADMIN, 'procurement'), userController.getAllUsers);
router.get("/:id", auth, roleAuth(ADMIN), userController.getUserById);
router.put("/:id", auth, roleAuth(ADMIN), userController.updateUser);

module.exports = router;
