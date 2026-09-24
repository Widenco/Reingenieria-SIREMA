// Estos endpoints devuelven los DATOS de cada reporte en JSON, no el PDF
// con el formato institucional (logo, encabezados, membrete) que arma
// TCPDF en el sistema original. Generar ese PDF exacto es una fase aparte
// (requiere plantillas HTML + Puppeteer, ver la conversación sobre stack
// tecnológico) -- esto desbloquea al frontend para mostrar la información
// en pantalla mientras tanto.

import { pool } from '../config/db.js';

export async function consolidadoBicuCnu(anioId, semestreId) {
  const [rows] = await pool.query('CALL reporte_consolidado_matriculados_bicu_cnu(:anioId, :semestreId)', {
    anioId,
    semestreId,
  });
  return rows[0];
}

export async function consolidadoPorCentro(nombreUsuario, centroId, anioId, semestreId) {
  const [rows] = await pool.query(
    'CALL reporte_consolidado_matriculados_centro(:nombreUsuario, :centroId, :anioId, :semestreId)',
    { nombreUsuario, centroId, anioId, semestreId }
  );
  return rows[0];
}

export async function consolidadoPorAreaConocimiento(anioId, areaId) {
  const [rows] = await pool.query('CALL reporte_consolidado_por_area_conocimiento(:anioId, :areaId)', {
    anioId,
    areaId,
  });
  return rows[0];
}

export async function consolidadoUnicam(centroId) {
  const [rows] = await pool.query('CALL reporte_consolidad_matriculados_unicam(:centroId)', {
    centroId,
  });
  return rows[0];
}

export async function multiplePorTipoIngreso(nombreUsuario, centroId, tipoIngresoId, semestreId, anioLectivoId, tipo) {
  const [rows] = await pool.query(
    'CALL reporte_multiple_matriculados_por_tipoIngreso_centros(:nombreUsuario, :centroId, :tipoIngresoId, :semestreId, :anioLectivoId, :tipo)',
    { nombreUsuario, centroId, tipoIngresoId, semestreId, anioLectivoId, tipo }
  );
  return rows[0];
}

export async function multiplePorTipoIngresoDetalle(centroId, tipoIngresoId, semestreId, anioLectivoId) {
  const [rows] = await pool.query(
    'CALL reporte_multiple_matriculados_por_tipoIngreso_centros_detalle(:centroId, :tipoIngresoId, :semestreId, :anioLectivoId)',
    { centroId, tipoIngresoId, semestreId, anioLectivoId }
  );
  return rows[0];
}

export async function registroIndividual(id) {
  const [rows] = await pool.query('CALL reporte_registro_matriculado_individual(:id)', { id });
  return rows[0];
}

export async function registroIndividualDetalle(id) {
  const [rows] = await pool.query('CALL reporte_registro_matriculado_individual_detalle(:id)', {
    id,
  });
  return rows[0];
}

export async function ultimaActualizacionPorCentro(nombreUsuario, centroId, tipoIngresoId, semestreId, anioLectivoId) {
  const [rows] = await pool.query(
    'CALL reporte_ultima_actualizacion_de_registros_por_centro(:nombreUsuario, :centroId, :tipoIngresoId, :semestreId, :anioLectivoId)',
    { nombreUsuario, centroId, tipoIngresoId, semestreId, anioLectivoId }
  );
  return rows[0];
}

export async function ultimaActualizacionPorCentroDetalle(nombreUsuario, centroId, tipoIngresoId, semestreId, anioLectivoId) {
  const [rows] = await pool.query(
    'CALL reporte_ultima_actualizacion_de_registro_por_centro_detalle(:nombreUsuario, :centroId, :tipoIngresoId, :semestreId, :anioLectivoId)',
    { nombreUsuario, centroId, tipoIngresoId, semestreId, anioLectivoId }
  );
  return rows[0];
}
