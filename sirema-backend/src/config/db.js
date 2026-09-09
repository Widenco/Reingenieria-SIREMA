// Reemplaza a models/config.php del sistema original.
// Antes: credenciales hardcodeadas ("root" / "1234") directo en el código fuente.
// Ahora: todo viene de variables de entorno (.env, nunca commiteado).

import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

// Uso típico en un service:
//   const [rows] = await pool.query('CALL matriculado_index()');
// Para stored procedures que devuelven un solo result set, rows[0] trae los datos.
