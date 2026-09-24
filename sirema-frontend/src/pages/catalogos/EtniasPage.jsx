import { useEffect, useState } from 'react';
import {
  listarEtnias,
  crearEtnia,
  actualizarEtnia,
  cambiarEstadoEtnia,
} from '../../api/endpoints/etnias.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModal } from '../../components/modales/FormularioModal.jsx';
import styles from '../administracion/AdministracionPage.module.css';

export function EtniasPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  // Modal crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [etniaEditando, setEtniaEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Confirmación de cambio de estado
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  // Notificación
  const [notificacion, setNotificacion] = useState(null);

  const cargar = () => {
    listarEtnias()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las etnias.'));
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setEtniaEditando(null);
    setDescripcion('');
    setModalAbierto(true);
  };

  const abrirEditar = (etnia) => {
    setEtniaEditando(etnia);
    setDescripcion(etnia.DescripcionEtnia);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setEtniaEditando(null);
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
      if (etniaEditando) {
        await actualizarEtnia(etniaEditando.Id, { descripcion: descripcion.trim() });
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Etnia ha sido actualizada exitosamente.',
        });
      } else {
        await crearEtnia({ descripcion: descripcion.trim() });
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Etnia ha sido creada exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar la etnia.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const pedirConfirmacion = (etnia) => setConfirmacion({ etnia });

  const cerrarConfirmacion = () => {
    if (procesandoEstado) return;
    setConfirmacion(null);
  };

  const ejecutarCambioEstado = async () => {
    if (!confirmacion) return;
    try {
      setProcesandoEstado(true);
      await cambiarEstadoEtnia(confirmacion.etnia.Id);
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
        <p>Catálogos</p>
        <h1>Etnias</h1>
        <span>Etnias registradas en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Etnias</h2>
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
                + Nueva Etnia
              </button>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Etnia</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionEtnia}</td>
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

      {/* Modales reutilizables */}
      {modalAbierto && (
        <FormularioModal
          titulo={etniaEditando ? 'Editar Etnia' : 'Nueva Etnia'}
          label="Descripción"
          valor={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          placeholder="Ej: Mestizo"
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