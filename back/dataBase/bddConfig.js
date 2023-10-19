require("dotenv").config(); // Cargo las variables de entorno desde .env

const pgp = require("pg-promise")();

const bddConfig = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
};

const db = pgp(bddConfig);

// Manejo eventos de conexión
db.connect()
  .then((obj) => {
    // La conexión se realizó con éxito
    obj.done(); // Termina la conexión
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

module.exports = db;
