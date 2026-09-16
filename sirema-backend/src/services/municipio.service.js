import { pool } from '../config/db.js';

export async function listarMunicipios() {
  // municipio_index() solo devuelve WHERE Estado = 1 (activos) --
  // a diferencia de menu_index/usuario_index que devuelven todo.
  const [rows] = await pool.query('CALL municipio_index()');
  return rows[0];
}

export async function buscarMunicipio(id) {
  const [rows] = await pool.query('CALL municipio_encontrar(:id)', { id });
  return rows[0][0] ?? null;
}

export async function crearMunicipio(datos) {
  const { descripcion } = datos;
  await pool.query('CALL municipio_crear(:descripcion)', { descripcion });
}

export async function actualizarMunicipio(id, datos) {
  const { descripcion } = datos;
  // OJO orden real: (Descripcion, Id_Consultar) -- el id va SEGUNDO aquí,
  // a diferencia de menu_actualizar donde el id va primero. Cada
  // procedimiento del sistema original tiene su propio orden, revisa
  // siempre con SHOW CREATE PROCEDURE antes de asumir un patrón.
  await pool.query('CALL municipio_actualizar(:descripcion, :id)', { descripcion, id });
}

export async function cambiarEstadoMunicipio(id, nuevoEstado) {
  // OJO orden real: (Estado_N, Id_Consultar) -- invertido respecto a
  // menu_cambiar_estado(Id_Consultar, Estado_N).
  await pool.query('CALL municipio_cambiar_estado(:nuevoEstado, :id)', { nuevoEstado, id });
}
