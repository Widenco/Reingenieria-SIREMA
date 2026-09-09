// Ejemplo de wrapper delgado sobre un stored procedure ya existente en la BD.
// Equivalente directo a lo que hoy hace matriculadoModel.php, pero desde Node.
// La lógica de negocio se queda en el procedimiento; este archivo solo la invoca.

import { pool } from '../config/db.js';

export async function listarMatriculados(centroId) {
  const [rows] = await pool.query('CALL matriculado_index(:centroId)', { centroId });
  return rows[0];
}

export async function crearMatriculado(datos) {
  const { estudianteId, carreraId, centroId, anioLectivoId } = datos;
  const [result] = await pool.query(
    'CALL matriculado_crear(:estudianteId, :carreraId, :centroId, :anioLectivoId)',
    { estudianteId, carreraId, centroId, anioLectivoId }
  );
  return result;
}
