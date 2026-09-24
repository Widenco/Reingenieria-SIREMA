import { useEffect, useState } from 'react';
import { listarEnlaces } from '../../api/endpoints/enlaces.js';
import styles from './AdministracionPage.module.css';

export function EnlacesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarEnlaces()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los enlaces.'));
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Administración</p>
        <h1>Enlaces</h1>
        <span>Enlaces disponibles en el menú del sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Enlaces</h2>
            <span>{datos.length} registros</span>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Módulo</th>
                  <th>Acción</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.TextoMostrar ?? x.Nombre ?? '—'}</td>
                    <td>{x.Modulo || '—'}</td>
                    <td>{x.Accion || '—'}</td>
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