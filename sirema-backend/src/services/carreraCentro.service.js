// carreraCentro = administra qué carreras están habilitadas en cada centro
// (tabla puente carrera_centro). En el sistema original, carreraCentroModel.php
// usa los procedimientos filtro_* -- nombres poco convencionales, pero son
// los que existen y funcionan en la BD real.

import { pool } from '../config/db.js';

export async function carrerasNoPertenecientes(centroId) {
  const [rows] = await pool.query(
    'CALL filtro_getCarrerasNoPertenecientesAlCentro(:centroId)',
    { centroId }
  );
  return rows[0];
}

export async function carrerasPertenecientes(centroId) {
  const [rows] = await pool.query(
    'CALL filtro_getCarrerasPertenecienteAlCentro(:centroId)',
    { centroId }
  );
  return rows[0];
}

export async function habilitarCarreraCentro(carreraId, centroId) {
  // Este procedimiento hace insert-si-no-existe / reactivar-si-existe
  // (revisa la lógica de @existe en el procedimiento original).
  await pool.query('CALL filtro_habilitar_carrera_centro(:carreraId, :centroId)', {
    carreraId,
    centroId,
  });
}

export async function deshabilitarCarreraCentro(id) {
  // OJO: este procedimiento toma el Id de la FILA de carrera_centro,
  // no el par carreraId/centroId como los otros dos.
  await pool.query('CALL filtro_deshabilitarCarreraCentro(:id)', { id });
}
