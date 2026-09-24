import { useEffect, useState } from 'react';
import { listarCentros } from '../../api/endpoints/centros.js';
import { listarCarrerasPertenecientes } from '../../api/endpoints/carrerasCentro.js';
import styles from './AdministracionPage.module.css';

export function CarrerasCentroPage() {
  const [centros, setCentros] = useState([]);
  const [centroId, setCentroId] = useState('');
  const [carreras, setCarreras] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarCentros()
      .then(setCentros)
      .catch(() => setError('No fue posible cargar los centros.'));
  }, []);

  useEffect(() => {
    if (!centroId) {
      setCarreras(null);
      return;
    }
    listarCarrerasPertenecientes(centroId)
      .then(setCarreras)
      .catch(() => setError('No fue posible cargar las carreras.'));
  }, [centroId]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Administración</p>
        <h1>Carreras Centro</h1>
        <span>Asignación de carreras por centro.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Carreras por centro</h2>
          <select value={centroId} onChange={(e) => setCentroId(e.target.value)}>
            <option value="">Seleccioná un centro</option>
            {centros.map((c) => (
              <option key={c.Id} value={c.Id}>
                {c.DescripcionCentro}
              </option>
            ))}
          </select>
        </div>

        {!centroId && (
          <p className={styles.loading}>Elegí un centro para ver sus carreras.</p>
        )}
        {centroId && !carreras && (
          <p className={styles.loading}>Cargando carreras…</p>
        )}

        {carreras && carreras.length === 0 && (
          <p className={styles.loading}>Este centro no tiene carreras habilitadas.</p>
        )}

        {carreras && carreras.length > 0 && (
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Carrera</th>
                </tr>
              </thead>
              <tbody>
                {carreras.map((c) => (
                  <tr key={c.Id}>
                    <td>{c.carrera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}