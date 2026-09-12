import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerResumenAdministracion } from '../api/endpoints/administracion.js';
import { logout } from '../api/endpoints/auth.js';
import { useSession } from '../context/SessionContext.jsx';
import styles from './Home.module.css';

export function Home() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [datos, setDatos] = useState(null);
  const [catalogoSeleccionado, setCatalogoSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  useEffect(() => {
    obtenerResumenAdministracion()
      .then((respuesta) => {
        setDatos(respuesta);
        setCatalogoSeleccionado(respuesta.catalogos[0]?.clave ?? null);
      })
      .catch(() => setError('No fue posible cargar la información de administración.'));
  }, []);

  const catalogo = datos?.catalogos.find((item) => item.clave === catalogoSeleccionado);

  const cerrarSesion = async () => {
    setCerrandoSesion(true);
    try {
      await logout();
    } finally {
      setSession(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Administración</p>
          <h1>Usuarios y catálogos</h1>
          <p>Consulta la información registrada en SIREMA.</p>
        </div>
        <button className={styles.logout} type="button" onClick={cerrarSesion} disabled={cerrandoSesion}>
          {cerrandoSesion ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && <>
        <section className={styles.section} aria-labelledby="usuarios-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Administración</p><h2 id="usuarios-title">Usuarios</h2></div>
            <span className={styles.counter}>{datos.usuarios.length} registrados</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Fecha de creación</th></tr></thead>
              <tbody>{datos.usuarios.map((usuario) => <tr key={usuario.Id}>
                <td>{usuario.NombreUsuario}</td><td>{usuario.Rol || 'Sin rol'}</td>
                <td><span className={usuario.Estado ? styles.active : styles.inactive}>{usuario.Estado ? 'Activo' : 'Inactivo'}</span></td>
                <td>{new Date(usuario.FechaCreacion).toLocaleDateString('es-NI')}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="catalogos-title">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Datos maestros</p><h2 id="catalogos-title">Catálogos</h2></div></div>
          <div className={styles.catalogLayout}>
            <div className={styles.catalogList} role="tablist" aria-label="Catálogos disponibles">
              {datos.catalogos.map((item) => <button key={item.clave} type="button" onClick={() => setCatalogoSeleccionado(item.clave)} role="tab" aria-selected={item.clave === catalogoSeleccionado} className={item.clave === catalogoSeleccionado ? styles.catalogButtonSelected : styles.catalogButton}>
                <span>{item.nombre}</span><strong>{item.activos}</strong>
              </button>)}
            </div>
            {catalogo && <div className={styles.catalogDetail} role="tabpanel">
              <h3>{catalogo.nombre}</h3><p>{catalogo.activos} registros activos</p>
              <div className={styles.items}>{catalogo.items.map((item) => <div className={styles.item} key={item.Id}>
                <span>{item.Nombre}</span><span className={item.Estado ? styles.active : styles.inactive}>{item.Estado ? 'Activo' : 'Inactivo'}</span>
              </div>)}</div>
            </div>}
          </div>
        </section>
      </>}
    </main>
  );
}
