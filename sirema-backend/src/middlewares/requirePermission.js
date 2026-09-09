// Reemplaza a funcionUsuarioModel::validarPermiso(), que llamaba a un
// stored procedure (permiso_funcion_usuario) que ni siquiera existía en la BD.
// Ahora la validación vive en un solo lugar y se aplica explícitamente
// en cada ruta que lo necesite, en vez de depender de que cada controlador
// se acuerde de llamarla.

import { pool } from '../config/db.js';

/**
 * @param {string} acronimo - Acronimo de la función a validar (tabla `funciones`)
 */
export function requirePermission(acronimo) {
  return async (req, res, next) => {
    try {
      const rolId = req.session?.usuario?.rolId;
      if (!rolId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const [rows] = await pool.query(
        `SELECT rf.Id
         FROM rol_funciones rf
         INNER JOIN funciones f ON f.Id = rf.Funciones_Id
         WHERE rf.Rol_Id = :rolId AND f.Acronimo = :acronimo AND f.Estado = 1
         LIMIT 1`,
        { rolId, acronimo }
      );

      if (rows.length === 0) {
        return res.status(403).json({ error: 'No tienes permiso para esta acción' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
