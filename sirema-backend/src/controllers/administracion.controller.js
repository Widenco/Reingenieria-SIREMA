import { pool } from '../config/db.js';

const catalogos = [
  ['centros', 'Centros', 'centro', 'DescripcionCentro'],
  ['carreras', 'Carreras', 'carrera', 'DescripcionCarrera'],
  ['comunidades', 'Comunidades', 'comunidad', 'DescripcionComunidad'],
  ['municipios', 'Municipios', 'municipio', 'DescripcionMunicipio'],
  ['areas', 'Áreas del conocimiento', 'areas_del_conocimiento', 'DescripcionAreaConocimiento'],
  ['modalidades', 'Modalidades', 'modalidad', 'DescripcionModalidad'],
  ['tiposIngreso', 'Tipos de ingreso', 'tipo_ingreso', 'DescripcionTipoIngreso'],
  ['semestres', 'Semestres', 'semestre', 'DescripcionSemestre'],
  ['etnias', 'Etnias', 'etnia', 'DescripcionEtnia'],
  ['aniosLectivos', 'Años lectivos', 'anio_lectivo', 'AnioLectivo'],
];

export async function obtenerResumenAdministracion(req, res, next) {
  try {
    const [usuarios, catalogosConDatos] = await Promise.all([
      pool.query(`SELECT u.Id, u.NombreUsuario, r.Nombre AS Rol, u.Estado, u.FechaCreacion FROM usuarios u LEFT JOIN roles r ON r.Id = u.Rol_Id ORDER BY u.NombreUsuario`).then(([rows]) => rows),
      Promise.all(catalogos.map(async ([clave, nombre, tabla, campo]) => {
        const [items] = await pool.query(`SELECT Id, ${campo} AS Nombre, Estado FROM ${tabla} ORDER BY ${campo}`);
        return { clave, nombre, activos: items.filter((item) => item.Estado === 1).length, items };
      })),
    ]);
    res.json({ usuarios, catalogos: catalogosConDatos });
  } catch (error) {
    next(error);
  }
}
