import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerResumenAdministracion } from '../../api/endpoints/administracion.js';
import styles from './CatalogosPage.module.css';

export function CatalogosPage() {
  const [datos, setDatos] = useState(null); const [error, setError] = useState(''); const [params, setParams] = useSearchParams();
  useEffect(() => { obtenerResumenAdministracion().then(setDatos).catch(() => setError('No fue posible cargar los catálogos.')); }, []);
  const catalogo = datos?.catalogos.find((x) => x.clave === params.get('seleccion')) || datos?.catalogos[0];
  const seleccionar = (clave) => setParams({ seleccion: clave });
  return <main className={styles.page}><header className={styles.header}><p>Datos maestros</p><h1>Catálogos</h1><span>Consulta los catálogos disponibles en SIREMA.</span></header>{error && <p className={styles.error}>{error}</p>}{!datos && !error && <p className={styles.loading}>Cargando catálogos…</p>}{datos && <section className={styles.card}><div className={styles.list}>{datos.catalogos.map((x) => <button type="button" key={x.clave} className={x.clave === catalogo.clave ? styles.selected : ''} onClick={() => seleccionar(x.clave)}>{x.nombre}<strong>{x.activos}</strong></button>)}</div><div className={styles.detail}><div className={styles.detailHeader}><h2>{catalogo.nombre}</h2><span>{catalogo.activos} activos</span></div><div className={styles.items}>{catalogo.items.map((x) => <div key={x.Id}><span>{x.Nombre}</span><b className={x.Estado ? styles.active : styles.inactive}>{x.Estado ? 'Activo' : 'Inactivo'}</b></div>)}</div></div></section>}</main>;
}
