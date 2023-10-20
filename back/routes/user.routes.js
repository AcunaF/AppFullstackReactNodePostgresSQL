const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

// Rutas de usuario
router.get("/hola", (req, res) => {
  res.send("¡Hola, mundo desde /hola!");
});
router.get("/", check, UserController.getAllUsers);
router.get("/:id", check, UserController.getUserById);
router.post("/", check, UserController.createUser);
router.put("/:id", check, UserController.updateUser);
router.delete("/:id", check, UserController.deleteUser);
router.post("/login", UserController.login);

module.exports = router;
