import { useEffect, useState } from 'react';
import { listarCentros } from '../../api/endpoints/centros.js';
import {
  listarCarrerasPertenecientes,
  listarCarrerasDisponibles,
  habilitarCarreraCentro,
  deshabilitarCarreraCentro,
} from '../../api/endpoints/carrerasCentro.js';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import styles from '../administracion/AdministracionPage.module.css';

export function CarrerasCentroPage() {
  const [centros, setCentros] = useState([]);
  const [centroId, setCentroId] = useState('');
  const [habilitadas, setHabilitadas] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Búsqueda en cada columna
  const [busquedaHabilitadas, setBusquedaHabilitadas] = useState('');
  const [busquedaDisponibles, setBusquedaDisponibles] = useState('');

  // Confirmación y notificación
  const [confirmacion, setConfirmacion] = useState(null); 
  // { tipo: 'habilitar' | 'deshabilitar', carrera, centroId }
  const [procesando, setProcesando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Cargar centros al montar
  useEffect(() => {
    listarCentros()
      .then(setCentros)
      .catch(() => setError('No fue posible cargar los centros.'));
  }, []);

  // Cargar ambas listas al cambiar de centro
  useEffect(() => {
    if (!centroId) {
      setHabilitadas([]);
      setDisponibles([]);
      return;
    }
    setCargando(true);
    Promise.all([
      listarCarrerasPertenecientes(centroId),
      listarCarrerasDisponibles(centroId),
    ])
      .then(([hab, disp]) => {
        setHabilitadas(hab);
        setDisponibles(disp);
      })
      .catch(() => setError('No fue posible cargar las carreras.'))
      .finally(() => setCargando(false));
  }, [centroId]);

  const recargarListas = () => {
    if (!centroId) return;
    Promise.all([
      listarCarrerasPertenecientes(centroId),
      listarCarrerasDisponibles(centroId),
    ])
      .then(([hab, disp]) => {
        setHabilitadas(hab);
        setDisponibles(disp);
      })
      .catch(() => setError('No fue posible cargar las carreras.'));
  };

  const pedirHabilitar = (carrera) => {
    setConfirmacion({ tipo: 'habilitar', carrera });
  };

  const pedirDeshabilitar = (carrera) => {
    setConfirmacion({ tipo: 'deshabilitar', carrera });
  };

  const cerrarConfirmacion = () => {
    if (procesando) return;
    setConfirmacion(null);
  };

  const ejecutarAccion = async () => {
    if (!confirmacion) return;
    try {
      setProcesando(true);
      if (confirmacion.tipo === 'habilitar') {
        // El endpoint de "no-pertenecientes" devuelve "Id" que es el Id de la CARRERA
        await habilitarCarreraCentro(confirmacion.carrera.Id, Number(centroId));
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: `La carrera "${confirmacion.carrera.carrera}" fue habilitada en el centro.`,
        });
      } else {
        // El endpoint de "pertenecientes" devuelve "Id" que es el Id de carrera_centro
        await deshabilitarCarreraCentro(confirmacion.carrera.Id);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: `La carrera "${confirmacion.carrera.carrera}" fue deshabilitada del centro.`,
        });
      }
      setConfirmacion(null);
      recargarListas();
    } catch (err) {
      setConfirmacion(null);
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible realizar la acción.',
      });
    } finally {
      setProcesando(false);
    }
  };

  // Filtrar por búsqueda
  const filtradasHabilitadas = habilitadas.filter((c) =>
    c.carrera.toLowerCase().includes(busquedaHabilitadas.toLowerCase())
  );
  const filtradasDisponibles = disponibles.filter((c) =>
    c.carrera.toLowerCase().includes(busquedaDisponibles.toLowerCase())
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos Educación</p>
        <h1>Carreras por Centro</h1>
        <span>Asignación de carreras por centro.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Carreras por centro</h2>
          <select
            value={centroId}
            onChange={(e) => setCentroId(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              background: 'white',
            }}
          >
            <option value="">Seleccioná un centro</option>
            {centros.map((c) => (
              <option key={c.Id} value={c.Id}>
                {c.DescripcionCentro}
              </option>
            ))}
          </select>
        </div>

        {!centroId && (
          <p className={styles.loading}>Elegí un centro para ver y asignar sus carreras.</p>
        )}

        {centroId && cargando && (
          <p className={styles.loading}>Cargando carreras…</p>
        )}

        {centroId && !cargando && (
          <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', flexWrap: 'wrap' }}>
            {/* Columna izquierda: Habilitadas */}
            <div style={{ flex: 1, minWidth: '320px' }}>
              <div
                style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>✓ Habilitadas</span>
                <span>{filtradasHabilitadas.length}</span>
              </div>

              <input
                type="text"
                placeholder="Buscar..."
                value={busquedaHabilitadas}
                onChange={(e) => setBusquedaHabilitadas(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />

              <div
                style={{
                  maxHeight: '500px',
                  overflowY: 'auto',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 0.375rem 0.375rem',
                }}
              >
                {filtradasHabilitadas.length === 0 && (
                  <p style={{ padding: '1rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>
                    Sin carreras habilitadas
                  </p>
                )}
                {filtradasHabilitadas.map((c) => (
                  <div
                    key={c.Id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #f3f4f6',
                      gap: '0.75rem',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{c.carrera}</span>
                    <button
                      type="button"
                      onClick={() => pedirDeshabilitar(c)}
                      style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.25rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: Disponibles */}
            <div style={{ flex: 1, minWidth: '320px' }}>
              <div
                style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem 0.375rem 0 0',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>+ Disponibles</span>
                <span>{filtradasDisponibles.length}</span>
              </div>

              <input
                type="text"
                placeholder="Buscar..."
                value={busquedaDisponibles}
                onChange={(e) => setBusquedaDisponibles(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />

              <div
                style={{
                  maxHeight: '500px',
                  overflowY: 'auto',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 0.375rem 0.375rem',
                }}
              >
                {filtradasDisponibles.length === 0 && (
                  <p style={{ padding: '1rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>
                    No hay más carreras disponibles
                  </p>
                )}
                {filtradasDisponibles.map((c) => (
                  <div
                    key={c.Id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #f3f4f6',
                      gap: '0.75rem',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{c.carrera}</span>
                    <button
                      type="button"
                      onClick={() => pedirHabilitar(c)}
                      style={{
                        background: '#dcfce7',
                        color: '#166534',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.25rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Habilitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {confirmacion && (
        <ConfirmacionModal
          titulo="¿Estás seguro?"
          mensaje={
            confirmacion.tipo === 'habilitar'
              ? `Se habilitará "${confirmacion.carrera.carrera}" en este centro.`
              : `Se quitará "${confirmacion.carrera.carrera}" del centro.`
          }
          textoConfirmar={confirmacion.tipo === 'habilitar' ? 'Sí, habilitar!' : 'Sí, quitar!'}
          procesando={procesando}
          onConfirmar={ejecutarAccion}
          onCancelar={cerrarConfirmacion}
        />
      )}

      {notificacion && (
        <NotificacionModal
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}
    </main>
  );
}