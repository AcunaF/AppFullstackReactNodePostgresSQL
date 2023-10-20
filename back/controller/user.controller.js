//este código se encarga de la autenticación y autorización de usuarios con roles.
//configurando la autenticación de usuarios mediante JSON Web Tokens (JWT) y autorización basada en roles.
//Los usuarios pueden iniciar sesión, y dependiendo de su rol (administrador o merodeador), tienen acceso a rutas protegidas con middleware de autorización.
// Si son administradores, pueden realizar actualizaciones, y si son merodeadores, pueden ver datos específicos.

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const db = require("./dataBase/bddConfig");
const secretKey = "your-secret-key"; // Cambia esto a una clave segura

app.use(express.json());

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

// Middleware de autorización basada en roles
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res
        .status(403)
        .json({ error: "No tienes permiso para realizar esta acción" });
    }
  };
}
router.get("/hola", (req, res) => {
  res.send("¡Hola, mundo!"); // Respuesta para la ruta "/hola"
});

// Ruta para el inicio de sesión
/*app.post("/login", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {
    const user = await db.one(
      "SELECT * FROM users WHERE correo_electronico = $1 AND contrasena = $2",
      [correo_electronico, contrasena]
    );

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user.id, role: user.rol_id }, secretKey);

      res.json({ token });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(401).json({ error: "Credenciales incorrectas" });
  }
});*/
app.post("/login", async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {
    const login = await db.one(
      "SELECT * FROM login WHERE correo_electronico = $1",
      correo_electronico
    );

    const passwordMatch = await bcrypt.compare(contrasena, login.contrasena);

    if (passwordMatch) {
      // Si las contraseñas coinciden, puedes responder con un mensaje de éxito
      res.json({ message: "Inicio de sesión exitoso" });
    } else {
      // Si las contraseñas no coinciden, respondes con un estado 401 y un mensaje de error
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    // Si hay un error en la consulta SQL, respondes con un estado 500 y un mensaje de error
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
});

// ruta protegida para administradores
app.put(
  "/admin/update/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    // Lógica para actualizar datos, solo accesible por administradores
    res.json({ message: "Actualización exitosa (admin)" });
  }
);

// ruta protegida para merodeadores
app.get(
  "/merodeador/view/:id",
  authenticateToken,
  authorizeRole("merodeador"),
  async (req, res) => {
    // Lógica para ver datos, solo accesible por merodeadores
    res.json({ message: "Vista (merodeador)" });
  }
);

app.listen(3000, () => {
  console.log("Servidor en funcionamiento en el puerto 3000");
});
