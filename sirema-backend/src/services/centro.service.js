import { pool } from '../config/db.js';

export async function listarCentros() {
  // centro_index() depende de las vistas centro_hijos y centro_padres
  // (definidas en sirema.sql, no en sirema_routines.sql) -- si esto falla
  // con "table doesn't exist", confirma que esas 2 vistas se importaron.
  const [rows] = await pool.query('CALL centro_index()');
  return rows[0];
}

export async function buscarCentro(id) {
  const [rows] = await pool.query('CALL centro_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

// Cierra el hueco que identificamos antes (selector de "centro padre"
// al crear un CUR/extensión dependiente de una sede).
export async function listarCentrosPadres() {
  const [rows] = await pool.query('CALL centro_get_padres()');
  return rows[0];
}

export async function crearCentro(datos) {
  const { descripcion, tipoCentroId, comunidadId, padreId } = datos;
  await pool.query(
    'CALL centro_crear(:descripcion, :tipoCentroId, :comunidadId, :padreId)',
    { descripcion, tipoCentroId, comunidadId, padreId }
  );
}

export async function actualizarCentro(id, datos) {
  const { descripcion, tipoCentroId, comunidadId, padreId } = datos;
  // Orden real: (id_centro, Descripcion, TipoCentroId, ComunidadId, PadreId)
  // -- aquí el id SÍ va primero, a diferencia de municipio/comunidad/tipoCentro.
  await pool.query(
    'CALL centro_actualizar(:id, :descripcion, :tipoCentroId, :comunidadId, :padreId)',
    { id, descripcion, tipoCentroId, comunidadId, padreId }
  );
}

export async function cambiarEstadoCentro(id, nuevoEstado) {
  // Orden real: (Estado_N, Id_Consultar).
  await pool.query('CALL centro_cambiar_estado(:nuevoEstado, :id)', { nuevoEstado, id });
}
