const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

// Rutas de usuario
router.get("/", check, UserController.getAllUsers);
router.get("/:id", check, UserController.getUserById);
router.post("/", check, UserController.createUser);
router.put("/:id", check, UserController.updateUser);
router.delete("/:id", check, UserController.deleteUser);

module.exports = router;
