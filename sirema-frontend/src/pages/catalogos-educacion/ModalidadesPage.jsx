import { useEffect, useState } from 'react';
import {
  listarModalidades,
  crearModalidad,
  actualizarModalidad,
  cambiarEstadoModalidad,
} from '../../api/endpoints/modalidades.js';
import { listarTiposModalidad } from '../../api/endpoints/tiposModalidad.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModal } from '../../components/modales/FormularioModal.jsx';
import styles from '../administracion/AdministracionPage.module.css';

export function ModalidadesPage() {
  const [datos, setDatos] = useState(null);
  const [tiposModalidad, setTiposModalidad] = useState([]);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalidadEditando, setModalidadEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [tipoModalidadId, setTipoModalidadId] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const [notificacion, setNotificacion] = useState(null);

  const cargar = () => {
    listarModalidades()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las modalidades.'));
  };

  const cargarTiposModalidad = () => {
    listarTiposModalidad()
      .then(setTiposModalidad)
      .catch(() => setError('No fue posible cargar los tipos de modalidad.'));
  };

  useEffect(() => {
    cargar();
    cargarTiposModalidad();
  }, []);

  const abrirCrear = () => {
    setModalidadEditando(null);
    setDescripcion('');
    setTipoModalidadId('');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setModalidadEditando(item);
    setDescripcion(item.DescripcionModalidad);
    // El listado trae "Tipo" como texto → buscar el Id por nombre
    const tipoEncontrado = tiposModalidad.find((t) => t.DescripcionDeTipo === item.Tipo);
    setTipoModalidadId(tipoEncontrado ? String(tipoEncontrado.Id) : '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setModalidadEditando(null);
    setDescripcion('');
    setTipoModalidadId('');
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

    if (!tipoModalidadId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar un tipo de modalidad.',
      });
      return;
    }

    const payload = {
      descripcion: descripcion.trim(),
      tipoModalidadId: Number(tipoModalidadId),
    };

    try {
      setGuardando(true);
      if (modalidadEditando) {
        await actualizarModalidad(modalidadEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Modalidad ha sido actualizada exitosamente.',
        });
      } else {
        await crearModalidad(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Modalidad ha sido creada exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar la modalidad.',
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
      await cambiarEstadoModalidad(confirmacion.item.Id);
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
        <h1>Modalidades</h1>
        <span>Modalidades registradas en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Modalidades</h2>
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
                + Nueva Modalidad
              </button>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Modalidad</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionModalidad}</td>
                    <td>{x.Tipo || '—'}</td>
                    <td>
                      <span className={x.Estado ? styles.active : styles.inactive}>
                        {x.Estado ? 'Activa' : 'Inactiva'}
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
          titulo={modalidadEditando ? 'Editar Modalidad' : 'Nueva Modalidad'}
          label="Descripción"
          valor={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          placeholder="Ej: Regular"
          maxLength={90}
          extraField={
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Tipo de Modalidad
              </label>
              <select
                value={tipoModalidadId}
                onChange={(e) => setTipoModalidadId(e.target.value)}
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
                <option value="">Seleccioná un tipo</option>
                {tiposModalidad.map((t) => (
                  <option key={t.Id} value={t.Id}>
                    {t.DescripcionDeTipo}
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