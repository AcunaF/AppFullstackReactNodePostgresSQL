const jwt = require("jsonwebtoken");

const secretKey = "tandil2023"; //clave secreta segura

// Función para generar un token JWT, si llega a ser requerida?
function generateToken(user) {
  const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
  return token;
}
