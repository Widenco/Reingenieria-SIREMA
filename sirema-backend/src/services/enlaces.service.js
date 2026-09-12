// Enlaces = administración de la tabla `menu` (el sidebar de la app).
// En el sistema original esto vivía en urlModel.php / urlController.php.
// Esta capa NO reescribe la lógica de negocio: solo invoca los mismos
// stored procedures que ya existen y están probados en la base de datos.

import { pool } from '../config/db.js';

export async function listarEnlaces() {
  const [rows] = await pool.query('CALL menu_index()');
  return rows[0];
}

export async function buscarEnlace(id) {
  const [rows] = await pool.query('CALL menu_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crearEnlace(datos) {
  const { textoMostrar, modulo, iconoModulo, accion, iconoAccion, estado, padreId } = datos;
  await pool.query(
    'CALL menu_crear(:textoMostrar, :modulo, :iconoModulo, :accion, :iconoAccion, :estado, :padreId)',
    { textoMostrar, modulo, iconoModulo, accion, iconoAccion, estado, padreId }
  );
}

export async function actualizarEnlace(id, datos) {
  const { textoMostrar, modulo, iconoModulo, accion, iconoAccion, padreId } = datos;
  await pool.query(
    'CALL menu_actualizar(:id, :textoMostrar, :modulo, :iconoModulo, :accion, :iconoAccion, :padreId)',
    { id, textoMostrar, modulo, iconoModulo, accion, iconoAccion, padreId }
  );
}

export async function cambiarEstadoEnlace(id, nuevoEstado) {
  await pool.query('CALL menu_cambiar_estado(:id, :nuevoEstado)', { id, nuevoEstado });
}
