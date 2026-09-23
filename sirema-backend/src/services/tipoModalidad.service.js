import { pool } from '../config/db.js';

export async function listar() {
  const [rows] = await pool.query('CALL tipo_modalidad_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL tipo_modalidad_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crear(datos) {
  const { descripcion } = datos;
  // OJO: existen DOS procedimientos casi idénticos en la BD real:
  // tipo_modalidad_crear y tipo_modalidad_create (probablemente uno
  // quedó duplicado por error del equipo). Se usa tipo_modalidad_crear
  // (el nombre en español, consistente con el resto del sistema).
  await pool.query('CALL tipo_modalidad_crear(:descripcion)', { descripcion });
}

export async function actualizar(id, datos) {
  const { descripcion } = datos;
  await pool.query('CALL tipo_modalidad_actualizar(:id, :descripcion)', { id, descripcion });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL tipo_modalidad_cambiar_estado(:id, :nuevoEstado)', {
    id,
    nuevoEstado,
  });
}
