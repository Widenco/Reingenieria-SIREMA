import { pool } from '../config/db.js';

export async function listar() {
  const [rows] = await pool.query('CALL carrera_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL carrera_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crear(datos) {
  const { descripcion, areaConocimientoId } = datos;
  await pool.query('CALL carrera_crear(:descripcion, :areaConocimientoId)', {
    descripcion,
    areaConocimientoId,
  });
}

export async function actualizar(id, datos) {
  const { descripcion, areaConocimientoId } = datos;
  await pool.query('CALL carrera_actualizar(:id, :descripcion, :areaConocimientoId)', {
    id,
    descripcion,
    areaConocimientoId,
  });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL carrera_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
