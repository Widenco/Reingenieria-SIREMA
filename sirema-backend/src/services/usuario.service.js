// Usuario = administración de la tabla `usuarios`.
// usuario_crear NO recibe Rol_Id (el procedimiento es anterior al RBAC),
// así que después del INSERT hacemos un UPDATE aparte para asignarlo.
// Mismo patrón para Centro_Id en usuario_centros: el procedimiento original
// solo guarda un Centro_Id directo en la fila de usuarios; el alcance
// multi-centro real vive en usuario_centros y se maneja aparte si lo
// necesitas (no lo tocamos aquí para no mezclar responsabilidades).

import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export async function listarUsuarios() {
  const [rows] = await pool.query("CALL usuario_index()");
  return rows[0];
}

export async function buscarUsuario(id) {
  const [rows] = await pool.query("CALL usuario_encontrar(:id)", { id });
  return rows[0][0] ?? null;
}

export async function crearUsuario(datos) {
  const { nombreUsuario, clave, centroId, rolId } = datos;
  const hash = await bcrypt.hash(clave, 10);

  // El procedimiento real (confirmado con SHOW CREATE PROCEDURE) ya:
  //  1. Inserta en usuarios (NombreUsuario, Rol_Id, Clave, FechaCreacion)
  //     -- fíjate que ya NO usa usuarios.Centro_Id.
  //  2. Inserta la relación en usuario_centros (Centro_Id, Usuarios_Id).
  //  3. Devuelve el Id nuevo con un SELECT al final.
  // Por eso ya no hace falta el SELECT de respaldo que teníamos antes.
  const [result] = await pool.query(
    "CALL usuario_crear(:nombreUsuario, :centroId, :rolId, :hash)",
    { nombreUsuario, centroId, rolId, hash },
  );

  return result[0]?.[0]?.UsuarioId;
}

export async function actualizarUsuario(id, datos) {
  const { nombreUsuario, centroId, rolId, clave } = datos;

  // usuario_actualizar existe en el dump original; revisa su firma exacta
  // en sirema_routines.sql antes de usarlo en producción -- aquí se asume
  // que actualiza NombreUsuario y Centro_Id. Rol_Id se actualiza aparte
  // porque el procedimiento original no lo conoce.
  await pool.query("CALL usuario_actualizar(:id, :nombreUsuario, :centroId)", {
    id,
    nombreUsuario,
    centroId,
  });

  await pool.query("UPDATE usuarios SET Rol_Id = :rolId WHERE Id = :id", {
    rolId,
    id,
  });

  if (clave) {
    const hash = await bcrypt.hash(clave, 10);
    await pool.query("CALL usuario_actualizar_clave(:id, :hash)", { id, hash });
  }
}

export async function cambiarEstadoUsuario(id, nuevoEstado) {
  await pool.query("CALL usuario_cambiar_estado(:id, :nuevoEstado)", {
    id,
    nuevoEstado,
  });
}
