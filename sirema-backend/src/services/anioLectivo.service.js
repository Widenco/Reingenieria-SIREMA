import { pool } from '../config/db.js';

export async function listar() {
  const [rows] = await pool.query('CALL anio_lectivo_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL anio_lectivo_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crear(datos) {
  const { anio } = datos;
  await pool.query('CALL anio_lectivo_crear(:anio)', { anio });
}

export async function actualizar(id, datos) {
  const { anio } = datos;
  await pool.query('CALL anio_lectivo_actualizar(:id, :anio)', { id, anio });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL anio_lectivo_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
