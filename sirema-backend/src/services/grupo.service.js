import { pool } from '../config/db.js';

export async function listar() {
  const [rows] = await pool.query('CALL grupo_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL grupo_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crear(datos) {
  const { descripcion } = datos;
  await pool.query('CALL grupo_crear(:descripcion)', { descripcion });
}

export async function actualizar(id, datos) {
  const { descripcion } = datos;
  await pool.query('CALL grupo_actualizar(:id, :descripcion)', { id, descripcion });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL grupo_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
