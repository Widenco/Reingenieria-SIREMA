import { useEffect, useState } from 'react';
import { listarCentros } from '../../api/endpoints/centros.js';
import styles from '../administracion/AdministracionPage.module.css';

export function CentrosPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarCentros()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los centros.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos</p>
        <h1>Centros</h1>
        <span>Centros registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Centros</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Centro</th>
                  <th>Tipo</th>
                  <th>Comunidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionCentro}</td>
                    <td>{x.DescripcionTipoCentro || '—'}</td>
                    <td>{x.DescripcionComunidad || '—'}</td>
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