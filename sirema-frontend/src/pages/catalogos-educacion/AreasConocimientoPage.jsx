import { useEffect, useState } from 'react';
import {
  listarAreasConocimiento,
  crearAreaConocimiento,
  actualizarAreaConocimiento,
  cambiarEstadoAreaConocimiento,
} from '../../api/endpoints/areasConocimiento.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModalDoble } from '../../components/modales/FormularioModalDoble.jsx';
import styles from '../administracion/AdministracionPage.module.css';

export function AreasConocimientoPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [areaEditando, setAreaEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [acronimo, setAcronimo] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const [notificacion, setNotificacion] = useState(null);

  const cargar = () => {
    listarAreasConocimiento()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las áreas.'));
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setAreaEditando(null);
    setDescripcion('');
    setAcronimo('');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setAreaEditando(item);
    setDescripcion(item.DescripcionAreaConocimiento);
    setAcronimo(item.Acronimo || '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setAreaEditando(null);
    setDescripcion('');
    setAcronimo('');
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

    if (!acronimo.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'El acrónimo es obligatorio.',
      });
      return;
    }

    const payload = {
      descripcion: descripcion.trim(),
      acronimo: acronimo.trim(),
    };

    try {
      setGuardando(true);
      if (areaEditando) {
        await actualizarAreaConocimiento(areaEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Área de Conocimiento ha sido actualizada exitosamente.',
        });
      } else {
        await crearAreaConocimiento(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Área de Conocimiento ha sido creada exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el área.',
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
      await cambiarEstadoAreaConocimiento(confirmacion.item.Id);
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
        <h1>Áreas del Conocimiento</h1>
        <span>Áreas del conocimiento registradas en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Áreas del Conocimiento</h2>
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
                + Nueva Área
              </button>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Área</th>
                  <th>Acrónimo</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
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
        <FormularioModalDoble
          titulo={areaEditando ? 'Editar Área de Conocimiento' : 'Nueva Área de Conocimiento'}
          label1="Nombre del Área"
          valor1={descripcion}
          onChange1={(e) => setDescripcion(e.target.value)}
          placeholder1="Ej: Área del conocimiento de..."
          maxLength1={240}
          label2="Acrónimo del Área"
          valor2={acronimo}
          onChange2={(e) => setAcronimo(e.target.value)}
          placeholder2="Ej: ACCSS"
          maxLength2={25}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
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