import { pool } from '../config/db.js';

export async function listar() {
  // turno_index() ya hace JOIN con modalidad y trae el nombre, no solo el Id.
  const [rows] = await pool.query('CALL turno_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL turno_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

// Bonus: filtra los turnos de una modalidad específica -- útil para un
// selector dependiente en el frontend (elige modalidad -> filtra turnos).
export async function porModalidad(modalidadId) {
  const [rows] = await pool.query('CALL turnos_de_modalidad(:modalidadId)', { modalidadId });
  return rows[0];
}

export async function crear(datos) {
  const { descripcion, modalidadId } = datos;
  await pool.query('CALL turno_crear(:descripcion, :modalidadId)', {
    descripcion,
    modalidadId,
  });
}

export async function actualizar(id, datos) {
  const { descripcion, modalidadId } = datos;
  await pool.query('CALL turno_actualizar(:id, :descripcion, :modalidadId)', {
    id,
    descripcion,
    modalidadId,
  });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL turno_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
