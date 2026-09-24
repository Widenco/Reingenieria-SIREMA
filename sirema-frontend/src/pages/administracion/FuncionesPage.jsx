import { useEffect, useState } from 'react';
import {
  listarFunciones,
  crearFuncion,
  actualizarFuncion,
  cambiarEstadoFuncion,
} from '../../api/endpoints/funciones.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModalMulti } from '../../components/modales/FormularioModalMulti.jsx';
import { BarraTabla } from '../../components/tabla/BarraTabla.jsx';
import { Paginacion } from '../../components/tabla/Paginacion.jsx';
import { useTabla } from '../../hooks/useTabla.js';
import styles from './AdministracionPage.module.css';

export function FuncionesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState(null);
  const [controlador, setControlador] = useState('');
  const [accion, setAccion] = useState('');
  const [acronimo, setAcronimo] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Confirmación + notificación
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Hook de tabla
  const tabla = useTabla(datos, {
    campoBusqueda: 'Controller',
    porPaginaInicial: 10,
  });

  const cargar = () => {
    listarFunciones()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las funciones.'));
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setFuncionEditando(null);
    setControlador('');
    setAccion('');
    setAcronimo('');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setFuncionEditando(item);
    setControlador(item.Controller || '');
    setAccion(item.Accion || '');
    setAcronimo(item.Acronimo || '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setFuncionEditando(null);
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!controlador.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'El controlador es obligatorio.',
      });
      return;
    }
    if (!accion.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'La acción es obligatoria.',
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
      controlador: controlador.trim(),
      accion: accion.trim(),
      acronimo: acronimo.trim(),
    };

    try {
      setGuardando(true);
      if (funcionEditando) {
        await actualizarFuncion(funcionEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Función ha sido actualizada exitosamente.',
        });
      } else {
        await crearFuncion(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Función ha sido creada exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar la función.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const pedirConfirmacion = (item) => setConfirmacion({ item });

  const cerrarConfirmacion = () => {
    if (procesando) return;
    setConfirmacion(null);
  };

  const ejecutarCambioEstado = async () => {
    if (!confirmacion) return;
    try {
      setProcesando(true);
      await cambiarEstadoFuncion(confirmacion.item.Id);
      setConfirmacion(null);
      setNotificacion({
        tipo: 'exito',
        titulo: '¡Guardado!',
        mensaje: 'El estado de la función se actualizó correctamente.',
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
      setProcesando(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Administración</p>
        <h1>Funciones</h1>
        <span>Funciones y permisos configurados.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Funciones</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>{tabla.totalFiltrado} registros</span>
              <button
                type="button"
                onClick={abrirCrear}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.25rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Crear Función
              </button>
            </div>
          </div>

          <BarraTabla
            porPagina={tabla.porPagina}
            onCambiarPorPagina={tabla.setPorPagina}
            busqueda={tabla.busqueda}
            onCambiarBusqueda={tabla.setBusqueda}
          />

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Controlador</th>
                  <th>Acción</th>
                  <th>Acrónimo</th>
                  <th>Estado</th>
                  <th style={{ width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tabla.datosPaginados.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      No se encontraron funciones
                    </td>
                  </tr>
                )}
                {tabla.datosPaginados.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.Controller}</td>
                    <td>{x.Accion}</td>
                    <td>{x.Acronimo}</td>
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

          <Paginacion
            total={tabla.totalFiltrado}
            paginaActual={tabla.paginaActual}
            porPagina={tabla.porPagina}
            onCambiarPagina={tabla.setPaginaActual}
          />
        </section>
      )}

      {modalAbierto && (
        <FormularioModalMulti
          titulo={funcionEditando ? 'Editar Función' : 'Crear Nueva Función'}
          textoGuardar={funcionEditando ? 'Guardar' : 'Crear'}
          colorGuardar={funcionEditando ? '#1e40af' : '#16a34a'}
          campos={[
            {
              key: 'controlador',
              label: 'Controlador',
              tipo: 'text',
              valor: controlador,
              onChange: (e) => setControlador(e.target.value),
              placeholder: 'Ej: usuarioController',
              maxLength: 60,
              ancho: 'completo',
            },
            {
              key: 'accion',
              label: 'Acción',
              tipo: 'text',
              valor: accion,
              onChange: (e) => setAccion(e.target.value),
              placeholder: 'Ej: index',
              maxLength: 45,
            },
            {
              key: 'acronimo',
              label: 'Acrónimo',
              tipo: 'text',
              valor: acronimo,
              onChange: (e) => setAcronimo(e.target.value),
              placeholder: 'Ej: USIN',
              maxLength: 30,
            },
          ]}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          maxWidth="600px"
        />
      )}

      {confirmacion && (
        <ConfirmacionModal
          procesando={procesando}
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