import { useEffect, useState } from 'react';
import { listarUsuarios } from '../../api/endpoints/usuarios.js';
import styles from './AdministracionPage.module.css';

export function UsuariosPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarUsuarios()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los usuarios.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Administración</p>
        <h1>Usuarios</h1>
        <span>Usuarios registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Usuarios</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.NombreUsuario}</td>
                    <td>{x.Rol ?? x.RolNombre ?? '—'}</td>
                    <td>
                      <span className={x.Estado ? styles.active : styles.inactive}>
                        {x.Estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      {x.FechaCreacion
                        ? new Date(x.FechaCreacion).toLocaleDateString('es-NI')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}