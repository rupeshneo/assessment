const express = require("express");
const router = express.Router();
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

// Only admin can create and manage users
router.post("/", auth, roleAuth("admin"), userController.createUser);
router.get("/", auth, roleAuth("admin"), userController.getAllUsers);
router.get("/:id", auth, roleAuth("admin"), userController.getUserById);
router.put("/:id", auth, roleAuth("admin"), userController.updateUser);

module.exports = router;
