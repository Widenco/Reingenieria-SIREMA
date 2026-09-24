import { useEffect, useState } from 'react';
import { listarComunidades } from '../../api/endpoints/comunidades.js';
import styles from '../administracion/AdministracionPage.module.css';

export function ComunidadesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarComunidades()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las comunidades.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos</p>
        <h1>Comunidades</h1>
        <span>Comunidades registradas en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Comunidades</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Comunidad</th>
                  <th>Municipio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionComunidad}</td>
                    <td>{x.Municipio || '—'}</td>
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