import { pool } from '../config/db.js';

export async function listarTiposCentro() {
  const [rows] = await pool.query('CALL tipo_centro_index()');
  return rows[0];
}

export async function buscarTipoCentro(id) {
  const [rows] = await pool.query('CALL tipo_centro_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crearTipoCentro(datos) {
  const { descripcion } = datos;
  await pool.query('CALL tipo_centro_crear(:descripcion)', { descripcion });
}

export async function actualizarTipoCentro(id, datos) {
  const { descripcion } = datos;
  // Orden real: (Descripcion, Id_consultar).
  await pool.query('CALL tipo_centro_actualizar(:descripcion, :id)', { descripcion, id });
}

export async function cambiarEstadoTipoCentro(id, nuevoEstado) {
  // Orden real: (Estado_N, id_consultar).
  await pool.query('CALL tipo_centro_cambiar_estado(:nuevoEstado, :id)', { nuevoEstado, id });
}
