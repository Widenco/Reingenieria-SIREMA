import { useEffect, useState } from 'react';
import { listarAniosCarrera } from '../../api/endpoints/aniosCarrera.js';
import styles from '../administracion/AdministracionPage.module.css';

export function AniosCarreraPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarAniosCarrera()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los años de carrera.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos Educación</p>
        <h1>Años de Carrera</h1>
        <span>Años de carrera registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Años de Carrera</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionAnioCarrera}</td>
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