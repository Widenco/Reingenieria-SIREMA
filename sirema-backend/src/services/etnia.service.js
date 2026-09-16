import { pool } from '../config/db.js';

export async function listarEtnias() {
  const [rows] = await pool.query('CALL etnia_index()');
  return rows[0];
}

export async function buscarEtnia(id) {
  const [rows] = await pool.query('CALL etnia_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crearEtnia(datos) {
  const { descripcion } = datos;
  await pool.query('CALL etnia_crear(:descripcion)', { descripcion });
}

export async function actualizarEtnia(id, datos) {
  const { descripcion } = datos;
  // Orden real: (Id_Consultar, Descripcion) -- id PRIMERO, distinto de
  // municipio/comunidad/tipoCentro donde el id va después.
  await pool.query('CALL etnia_actualizar(:id, :descripcion)', { id, descripcion });
}

export async function cambiarEstadoEtnia(id, nuevoEstado) {
  // Orden real: (Id_Consultar, Estado_N) -- también id primero aquí.
  await pool.query('CALL etnia_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
