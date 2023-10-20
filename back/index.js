//este código se encarga de crear una API para gestionar usuarios,
//configurando las rutas y controladores para operaciones CRUD
//Las rutas permiten obtener todos los usuarios, obtener un usuario por su ID, crear un nuevo usuario, actualizar un usuario existente y eliminar un usuario.
//Se utiliza una base de datos (PostgreSQL) para almacenar los datos de usuario.

const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./dataBase/bddConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura CORS para permitir solicitudes desde http://localhost:3001
app.use(cors({ origin: "http://localhost:3001" }));

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Ha ocurrido un error en el servidor." });
});

// Ruta para obtener todos los usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await db.any("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios: ", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Ruta para obtener un usuario por su ID
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await db.one("SELECT * FROM users WHERE id = $1", userId);
    res.json(user);
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${userId}: `, error);
    res
      .status(500)
      .json({ error: `Error al obtener el usuario con ID ${userId}` });
  }
});

// Ruta para crear un nuevo usuario
app.post("/users", async (req, res) => {
  const newUser = req.body;
  try {
    const user = await db.one(
      "INSERT INTO users (nombre, apellido, correo_electronico, nombre_usuario, contrasena, rol_id) VALUES ($1, $2,$3, $4, $5,$6 ) RETURNING *",
      [
        newUser.nombre,
        newUser.apellido,
        newUser.correo_electronico,
        newUser.nombre_usuario,
        newUser.contrasena,
        newUser.rol_id,
      ]
    );
    res.json(user);
  } catch (error) {
    console.error("Error al crear un nuevo usuario: ", error);
    res.status(500).json({ error: "Error al crear un nuevo usuario" });
  }
});

// Ruta para actualizar un usuario existente
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  try {
    const user = await db.one(
      "UPDATE users SET nombre = $1, apellido = $2, correo_electronico = $3, nombre_usuario = $4, contrasena = $5, rol_id = $6 WHERE id = $7 RETURNING *",
      [
        updatedUser.nombre,
        updatedUser.apellido,
        updatedUser.correo_electronico,
        updatedUser.nombre_usuario,
        updatedUser.contrasena,
        updatedUser.rol_id,
        userId, // El ID del usuario que deseas actualizar
      ]
    );
    res.json(user);
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${userId}: `, error);
    res
      .status(500)
      .json({ error: `Error al actualizar el usuario con ID ${userId}` });
  }
});

// Ruta para eliminar un usuario
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await db.one(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      userId
    );
    res.json(user);
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${userId}: `, error);
    res
      .status(500)
      .json({ error: `Error al eliminar el usuario con ID ${userId}` });
  }
});

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

app.listen(3000, () => {
  console.log("Servidor Node.js en ejecución en el puerto 3000");
});
