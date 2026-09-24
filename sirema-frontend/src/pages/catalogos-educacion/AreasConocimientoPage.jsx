import { useEffect, useState } from 'react';
import { listarAreasConocimiento } from '../../api/endpoints/areasConocimiento.js';
import styles from '../administracion/AdministracionPage.module.css';

export function AreasConocimientoPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarAreasConocimiento()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las áreas.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos Educación</p>
        <h1>Áreas del Conocimiento</h1>
        <span>Áreas del conocimiento registradas en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Áreas del Conocimiento</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Acrónimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionAreaConocimiento}</td>
                    <td>{x.Acronimo || '—'}</td>
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