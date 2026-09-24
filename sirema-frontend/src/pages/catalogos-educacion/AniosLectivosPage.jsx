import { useEffect, useState } from 'react';
import { listarAniosLectivos } from '../../api/endpoints/aniosLectivos.js';
import styles from '../administracion/AdministracionPage.module.css';

export function AniosLectivosPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarAniosLectivos()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los años lectivos.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos Educación</p>
        <h1>Años Lectivos</h1>
        <span>Años lectivos registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Años Lectivos</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Año Lectivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.AnioLectivo ?? x.DescripcionAnioLectivo ?? x.Nombre ?? '—'}</td>
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