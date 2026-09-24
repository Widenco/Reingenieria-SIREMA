import { useEffect, useState } from 'react';
import { listarFunciones } from '../../api/endpoints/funciones.js';
import styles from './AdministracionPage.module.css';

export function FuncionesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarFunciones()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las funciones.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Administración</p>
        <h1>Funciones</h1>
        <span>Funciones y permisos configurados.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Funciones</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Controlador</th>
                  <th>Acción</th>
                  <th>Acrónimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.Controller ?? x.Controlador ?? '—'}</td>
                    <td>{x.Accion ?? x.Acción ?? '—'}</td>
                    <td>{x.Acronimo ?? x.Acrónimo ?? '—'}</td>
                    <td>
                      <span className={x.Estado ? styles.active : styles.inactive}>
                        {x.Estado ? 'Activo' : 'Inactivo'}
                      </span>
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