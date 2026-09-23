import { pool } from '../config/db.js';

export async function listar() {
  const [rows] = await pool.query('CALL modalidad_index()');
  return rows[0];
}

export async function buscar(id) {
  const [rows] = await pool.query('CALL modalidad_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crear(datos) {
  const { descripcion, tipoModalidadId } = datos;
  // ACTUALIZACIÓN: modalidad ahora depende de tipo_de_modalidad (columna
  // TipoModalidad_Id, NOT NULL). El procedimiento cambió de firma para
  // exigir este segundo parámetro -- confirmado con la base de datos real
  // más reciente del equipo (sirema.sql actualizado).
  await pool.query('CALL modalidad_crear(:descripcion, :tipoModalidadId)', {
    descripcion,
    tipoModalidadId,
  });
}

export async function actualizar(id, datos) {
  const { descripcion, tipoModalidadId } = datos;
  await pool.query('CALL modalidad_actualizar(:id, :descripcion, :tipoModalidadId)', {
    id,
    descripcion,
    tipoModalidadId,
  });
}

export async function cambiarEstado(id, nuevoEstado) {
  await pool.query('CALL modalidad_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
