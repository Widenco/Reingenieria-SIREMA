import { pool } from '../config/db.js';

// Todos estos procedimientos reciben el NombreUsuario (no el Id) para
// resolver internamente el alcance del usuario actual -- viene de
// req.session.usuario.nombreUsuario en el controller.

export async function listar(nombreUsuario, filtros) {
  const { centroId, carreraId, anioLectivoId, tipoIngresoId } = filtros;
  const [rows] = await pool.query(
    'CALL registro_matricula_index(:nombreUsuario, :centroId, :carreraId, :anioLectivoId, :tipoIngresoId)',
    { nombreUsuario, centroId, carreraId, anioLectivoId, tipoIngresoId }
  );
  return rows[0];
}

// Reemplaza matriculadoController::getCentros -- centros PERMITIDOS al
// usuario actual (no todos los centros del sistema).
export async function centrosPermitidos(nombreUsuario, tipo) {
  const [rows] = await pool.query('CALL permiso_centros_usuario(:nombreUsuario, :tipo)', {
    nombreUsuario,
    tipo,
  });
  return rows[0];
}

// Reemplaza matriculadoController::getCarreras -- carreras habilitadas
// en ESE centro para el usuario actual.
export async function carrerasPermitidas(centroId, nombreUsuario) {
  const [rows] = await pool.query(
    'CALL permiso_carreras_centro_usuario(:centroId, :nombreUsuario)',
    { centroId, nombreUsuario }
  );
  return rows[0];
}

export async function crear(nombreUsuario, datos) {
  const { centroId, carreraId, tipoIngresoId, semestreId, anioLectivoId, total, detalle } = datos;

  const [result] = await pool.query(
    'CALL registro_matricula_crear(:centroId, :carreraId, :tipoIngresoId, :semestreId, :anioLectivoId, :nombreUsuario, :total)',
    { centroId, carreraId, tipoIngresoId, semestreId, anioLectivoId, nombreUsuario, total }
  );
  const matriculaId = result[0]?.[0]?.lastId;

  if (!matriculaId) {
    const err = new Error('No se pudo crear el registro de matrícula');
    err.status = 500;
    throw err;
  }

  // Un INSERT por cada fila de detalle (año de carrera / modalidad / grupo /
  // turno / cantidades) -- igual que hacía el foreach del modelo PHP original.
  for (const fila of detalle) {
    await pool.query(
      'CALL registro_detalle_matriculados_crear(:matriculaId, :anioCarreraId, :modalidadId, :grupoId, :turnoId, :femenino, :masculino)',
      {
        matriculaId,
        anioCarreraId: fila.anioCarreraId,
        modalidadId: fila.modalidadId,
        grupoId: fila.grupoId,
        turnoId: fila.turnoId,
        femenino: fila.femenino,
        masculino: fila.masculino,
      }
    );
  }

  return matriculaId;
}

export async function anular(id) {
  await pool.query('CALL registro_matricula_anular(:id)', { id });
}
