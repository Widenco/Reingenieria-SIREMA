import { pool } from '../config/db.js';

export async function listar() {
  const [rows] = await pool.query('CALL area_conocimiento_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL area_conocimiento_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crear(datos) {
  const { descripcion, acronimo } = datos;
  await pool.query('CALL area_conocimiento_crear(:descripcion, :acronimo)', {
    descripcion,
    acronimo,
  });
}

export async function actualizar(id, datos) {
  const { descripcion, acronimo } = datos;
  await pool.query('CALL area_conocimiento_actualizar(:id, :descripcion, :acronimo)', {
    id,
    descripcion,
    acronimo,
  });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL area_conocimiento_cambiar_estado(:id, :nuevoEstado)', {
    id,
    nuevoEstado,
  });
}
