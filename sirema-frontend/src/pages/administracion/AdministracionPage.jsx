import { useEffect, useState } from 'react';
import { obtenerResumenAdministracion } from '../../api/endpoints/administracion.js';
import styles from './AdministracionPage.module.css';

const configuracion = {
  enlaces: { titulo: 'Enlaces', descripcion: 'Enlaces disponibles en el menú del sistema.', columnas: ['Nombre', 'Módulo', 'Acción', 'Estado'], filas: (datos) => datos.enlaces.map((x) => [x.TextoMostrar, x.Modulo || '—', x.Accion || '—', x.Estado]) },
  usuarios: { titulo: 'Usuarios', descripcion: 'Usuarios registrados en el sistema.', columnas: ['Usuario', 'Rol', 'Estado', 'Fecha de creación'], filas: (datos) => datos.usuarios.map((x) => [x.NombreUsuario, x.Rol || 'Sin rol', x.Estado, new Date(x.FechaCreacion).toLocaleDateString('es-NI')]) },
  'carreras-centro': { titulo: 'Carreras Centro', descripcion: 'Asignación de carreras por centro.', columnas: ['Centro', 'Carrera', 'Estado'], filas: (datos) => datos.carrerasCentro.map((x) => [x.Centro, x.Carrera, x.Estado]) },
  funciones: { titulo: 'Funciones', descripcion: 'Funciones y permisos configurados.', columnas: ['Controlador', 'Acción', 'Acrónimo', 'Estado'], filas: (datos) => datos.funciones.map((x) => [x.Controller, x.Accion, x.Acronimo, x.Estado]) },
};

export function AdministracionPage({ seccion }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const config = configuracion[seccion];

  useEffect(() => { obtenerResumenAdministracion().then(setDatos).catch(() => setError('No fue posible cargar la información.')); }, []);
  const filas = datos ? config.filas(datos) : [];

  return <main className={styles.page}>
    <header className={styles.header}><p>Administración</p><h1>{config.titulo}</h1><span>{config.descripcion}</span></header>
    {error && <p className={styles.error} role="alert">{error}</p>}
    {!datos && !error && <p className={styles.loading}>Cargando información…</p>}
    {datos && <section className={styles.card}><div className={styles.cardHeader}><h2>{config.titulo}</h2><span>{filas.length} registros</span></div><div className={styles.tableWrap}><table><thead><tr>{config.columnas.map((columna) => <th key={columna}>{columna}</th>)}</tr></thead><tbody>{filas.map((fila, index) => <tr key={index}>{fila.map((valor, columna) => <td key={columna}>{typeof valor === 'number' || typeof valor === 'boolean' ? <span className={valor ? styles.active : styles.inactive}>{valor ? 'Activo' : 'Inactivo'}</span> : valor}</td>)}</tr>)}</tbody></table></div></section>}
  </main>;
}
