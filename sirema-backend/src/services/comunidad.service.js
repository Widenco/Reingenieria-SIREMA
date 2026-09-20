import { pool } from '../config/db.js';

export async function listarComunidades() {
  // comunidad_index() hace JOIN con municipio (trae Municipio como texto)
  // y también filtra WHERE Estado = 1, igual que municipio_index.
  const [rows] = await pool.query('CALL comunidad_index()');
  return rows[0];
}

export async function buscarComunidad(id) {
  const [rows] = await pool.query('CALL comunidad_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crearComunidad(datos) {
  const { descripcion, municipioId } = datos;
  await pool.query('CALL comunidad_crear(:descripcion, :municipioId)', {
    descripcion,
    municipioId,
  });
}

export async function actualizarComunidad(id, datos) {
  const { descripcion, municipioId } = datos;
  // Orden real: (Descripcion, MunicipioId, Id_Consultar) -- el id va al final.
  await pool.query('CALL comunidad_actualizar(:descripcion, :municipioId, :id)', {
    descripcion,
    municipioId,
    id,
  });
}

export async function cambiarEstadoComunidad(id, nuevoEstado) {
  // Orden real: (Estado_N, Id_Consultar).
  await pool.query('CALL comunidad_cambiar_estado(:nuevoEstado, :id)', { nuevoEstado, id });
}
