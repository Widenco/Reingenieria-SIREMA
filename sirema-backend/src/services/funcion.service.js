// Funciones = administración de la tabla `funciones` (catálogo de acciones
// que luego se asignan a roles vía rol_funciones). Depende de los
// procedimientos creados en la migración 20260102000000 -- corre
// npm run migrate antes de probar este módulo.

import { pool } from '../config/db.js';

export async function listarFunciones() {
  const [rows] = await pool.query('CALL funcion_index()');
  return rows[0];
}

export async function buscarFuncion(id) {
  const [rows] = await pool.query('CALL funcion_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crearFuncion(datos) {
  const { controlador, accion, acronimo } = datos;
  await pool.query('CALL funcion_crear(:controlador, :accion, :acronimo)', {
    controlador,
    accion,
    acronimo,
  });
}

export async function actualizarFuncion(id, datos) {
  const { controlador, accion, acronimo } = datos;
  await pool.query('CALL funcion_actualizar(:id, :controlador, :accion, :acronimo)', {
    id,
    controlador,
    accion,
    acronimo,
  });
}

export async function cambiarEstadoFuncion(id, nuevoEstado) {
  await pool.query('CALL funcion_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
