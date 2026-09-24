import { useEffect, useState } from 'react';
import {
  listarTurnos,
  crearTurno,
  actualizarTurno,
  cambiarEstadoTurno,
} from '../../api/endpoints/turnos.js';
import { listarModalidades } from '../../api/endpoints/modalidades.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModal } from '../../components/modales/FormularioModal.jsx';
import styles from '../administracion/AdministracionPage.module.css';

export function TurnosPage() {
  const [datos, setDatos] = useState(null);
  const [modalidades, setModalidades] = useState([]);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoEditando, setTurnoEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [modalidadId, setModalidadId] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const [notificacion, setNotificacion] = useState(null);

  const cargar = () => {
    listarTurnos()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los turnos.'));
  };

  const cargarModalidades = () => {
    listarModalidades()
      .then(setModalidades)
      .catch(() => setError('No fue posible cargar las modalidades.'));
  };

  useEffect(() => {
    cargar();
    cargarModalidades();
  }, []);

  const abrirCrear = () => {
    setTurnoEditando(null);
    setDescripcion('');
    setModalidadId('');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setTurnoEditando(item);
    setDescripcion(item.DescripcionTurno);
    // Buscar la modalidad por nombre (porque el listado trae "Modalidad" como texto)
    const modEncontrada = modalidades.find((m) => m.DescripcionModalidad === item.Modalidad);
    setModalidadId(modEncontrada ? String(modEncontrada.Id) : '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setTurnoEditando(null);
    setDescripcion('');
    setModalidadId('');
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

    if (!modalidadId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar una modalidad.',
      });
      return;
    }

    const payload = {
      descripcion: descripcion.trim(),
      modalidadId: Number(modalidadId),
    };

    try {
      setGuardando(true);
      if (turnoEditando) {
        await actualizarTurno(turnoEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Turno ha sido actualizado exitosamente.',
        });
      } else {
        await crearTurno(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Turno ha sido creado exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el turno.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const pedirConfirmacion = (item) => setConfirmacion({ item });

  const cerrarConfirmacion = () => {
    if (procesandoEstado) return;
    setConfirmacion(null);
  };

  const ejecutarCambioEstado = async () => {
    if (!confirmacion) return;
    try {
      setProcesandoEstado(true);
      await cambiarEstadoTurno(confirmacion.item.Id);
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
        <h1>Turnos</h1>
        <span>Turnos registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Turnos</h2>
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
                + Nuevo Turno
              </button>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Turno</th>
                  <th>Modalidad</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionTurno}</td>
                    <td>{x.Modalidad || '—'}</td>
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
          titulo={turnoEditando ? 'Editar Turno' : 'Nuevo Turno'}
          label="Descripción"
          valor={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          placeholder="Ej: Matutino"
          maxLength={40}
          extraField={
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Modalidad
              </label>
              <select
                value={modalidadId}
                onChange={(e) => setModalidadId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  background: 'white',
                }}
              >
                <option value="">Seleccioná una modalidad</option>
                {modalidades.map((m) => (
                  <option key={m.Id} value={m.Id}>
                    {m.DescripcionModalidad}
                  </option>
                ))}
              </select>
            </div>
          }
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