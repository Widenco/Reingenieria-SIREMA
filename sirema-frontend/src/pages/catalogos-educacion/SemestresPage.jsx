import { useEffect, useState } from 'react';
import {
  listarSemestres,
  crearSemestre,
  actualizarSemestre,
  cambiarEstadoSemestre,
} from '../../api/endpoints/semestres.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModal } from '../../components/modales/FormularioModal.jsx';
import styles from '../administracion/AdministracionPage.module.css';

export function SemestresPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [semestreEditando, setSemestreEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const [notificacion, setNotificacion] = useState(null);

  const cargar = () => {
    listarSemestres()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los semestres.'));
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setSemestreEditando(null);
    setDescripcion('');
    setModalAbierto(true);
  };

  const abrirEditar = (semestre) => {
    setSemestreEditando(semestre);
    setDescripcion(semestre.DescripcionSemestre);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setSemestreEditando(null);
    setDescripcion('');
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'La descripción es obligatoria.',
      });
      return;
    }

    try {
      setGuardando(true);
      if (semestreEditando) {
        await actualizarSemestre(semestreEditando.Id, { descripcion: descripcion.trim() });
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Semestre ha sido actualizado exitosamente.',
        });
      } else {
        await crearSemestre({ descripcion: descripcion.trim() });
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Semestre ha sido creado exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el semestre.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const pedirConfirmacion = (semestre) => setConfirmacion({ semestre });

  const cerrarConfirmacion = () => {
    if (procesandoEstado) return;
    setConfirmacion(null);
  };

  const ejecutarCambioEstado = async () => {
    if (!confirmacion) return;
    try {
      setProcesandoEstado(true);
      await cambiarEstadoSemestre(confirmacion.semestre.Id);
      setConfirmacion(null);
      setNotificacion({
        tipo: 'exito',
        titulo: '¡Guardado!',
        mensaje: 'El estado del registro se actualizó correctamente.',
      });
      cargar();
    } catch (err) {
      setConfirmacion(null);
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible cambiar el estado.',
      });
    } finally {
      setProcesandoEstado(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Catálogos Educación</p>
        <h1>Semestres</h1>
        <span>Semestres registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Semestres</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>{datos.length} registros</span>
              <button
                type="button"
                onClick={abrirCrear}
                style={{
                  background: '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                + Nuevo Semestre
              </button>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Semestre</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionSemestre}</td>
                    <td>
                      <span className={x.Estado ? styles.active : styles.inactive}>
                        {x.Estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => abrirEditar(x)}
                          style={{
                            background: '#e5e7eb',
                            color: '#1f2937',
                            border: 'none',
                            borderRadius: '0.375rem',
                            padding: '0.25rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => pedirConfirmacion(x)}
                          style={{
                            background: x.Estado ? '#fee2e2' : '#dcfce7',
                            color: x.Estado ? '#991b1b' : '#166534',
                            border: 'none',
                            borderRadius: '0.375rem',
                            padding: '0.25rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          {x.Estado ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {modalAbierto && (
        <FormularioModal
          titulo={semestreEditando ? 'Editar Semestre' : 'Nuevo Semestre'}
          label="Descripción"
          valor={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          placeholder="Ej: I Semestre"
          maxLength={40}
        />
      )}

      {confirmacion && (
        <ConfirmacionModal
          procesando={procesandoEstado}
          onConfirmar={ejecutarCambioEstado}
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