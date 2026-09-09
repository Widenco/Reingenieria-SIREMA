import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export async function login(req, res, next) {
  try {
    const { nombreUsuario, clave } = req.body;

    const [rows] = await pool.query(
      "SELECT Id, NombreUsuario, Clave, Rol_Id, Estado FROM usuarios WHERE NombreUsuario = :nombreUsuario LIMIT 1",
      { nombreUsuario },
    );
    const usuario = rows[0];

    if (!usuario || usuario.Estado !== 1) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // PHP's password_hash() genera hashes con el prefijo $2y$. El algoritmo
    // es el mismo bcrypt que usa Node, pero algunas comparaciones de cadena
    // fallan si el prefijo no coincide exactamente. Normalizamos $2y$ -> $2b$
    // antes de comparar; esto es seguro porque, para contraseñas ASCII
    // normales, ambas variantes calculan el mismo hash.
    const hashNormalizado = usuario.Clave.replace(/^\$2y\$/, "$2b$");
    const claveValida = await bcrypt.compare(clave, hashNormalizado);
    if (!claveValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const [centros] = await pool.query(
      "SELECT Centro_Id FROM usuario_centros WHERE Usuarios_Id = :id",
      { id: usuario.Id },
    );

    // Esto es el equivalente exacto de $_SESSION['usuario'] = [...] en PHP.
    // express-session guarda esto en el servidor y solo manda al navegador
    // un ID de sesión dentro de una cookie httpOnly (por defecto: connect.sid).
    req.session.usuario = {
      usuarioId: usuario.Id,
      rolId: usuario.Rol_Id,
      centros: centros.map((c) => c.Centro_Id),
    };

    res.json(req.session.usuario);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const { rolId } = req.session.usuario;

    const [menu] = await pool.query(
      `SELECT m.* FROM menu m
       INNER JOIN rol_menu rm ON rm.Menu_Id = m.Id
       WHERE rm.Rol_Id = :rolId
       ORDER BY m.Orden`,
      { rolId },
    );

    res.json({ ...req.session.usuario, menu });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
}
