import { useEffect, useState } from 'react';
import {
  listarEnlaces,
  crearEnlace,
  actualizarEnlace,
  cambiarEstadoEnlace,
} from '../../api/endpoints/enlaces.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModalMulti } from '../../components/modales/FormularioModalMulti.jsx';
import { BarraTabla } from '../../components/tabla/BarraTabla.jsx';
import { Paginacion } from '../../components/tabla/Paginacion.jsx';
import { useTabla } from '../../hooks/useTabla.js';
import styles from './AdministracionPage.module.css';

export function EnlacesPage() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enlaceEditando, setEnlaceEditando] = useState(null);
  const [textoMostrar, setTextoMostrar] = useState('');
  const [modulo, setModulo] = useState('');
  const [padreId, setPadreId] = useState('0');
  const [accion, setAccion] = useState('');
  const [iconoModulo, setIconoModulo] = useState('');
  const [iconoAccion, setIconoAccion] = useState('');
  const [estadoNuevo, setEstadoNuevo] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Confirmación + notificación
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Hook de tabla
  const tabla = useTabla(datos, {
    campoBusqueda: 'TextoMostrar',
    porPaginaInicial: 10,
  });

  const cargar = () => {
    listarEnlaces()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los enlaces.'));
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setEnlaceEditando(null);
    setTextoMostrar('');
    setModulo('');
    setPadreId('0');
    setAccion('');
    setIconoModulo('');
    setIconoAccion('');
    setEstadoNuevo(true);
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setEnlaceEditando(item);
    setTextoMostrar(item.TextoMostrar || '');
    setModulo(item.Modulo || '');
    setPadreId(item.Padre_Id ? String(item.Padre_Id) : '0');
    setAccion(item.Accion || '');
    setIconoModulo(item.IconoModulo || '');
    setIconoAccion(item.IconoAccion || '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setEnlaceEditando(null);
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!textoMostrar.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'El texto a mostrar es obligatorio.',
      });
      return;
    }
    if (!modulo.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'El módulo es obligatorio.',
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

    const payload = {
      textoMostrar: textoMostrar.trim(),
      modulo: modulo.trim(),
      accion: accion.trim(),
      iconoModulo: iconoModulo.trim(),
      iconoAccion: iconoAccion.trim(),
      padreId: Number(padreId) || 0,
    };

    try {
      setGuardando(true);
      if (enlaceEditando) {
        await actualizarEnlace(enlaceEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Enlace ha sido actualizado exitosamente.',
        });
      } else {
        await crearEnlace({ ...payload, estado: estadoNuevo });
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Enlace ha sido creado exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el enlace.',
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
      await cambiarEstadoEnlace(confirmacion.item.Id);
      setConfirmacion(null);
      setNotificacion({
        tipo: 'exito',
        titulo: '¡Guardado!',
        mensaje: 'El estado del enlace se actualizó correctamente.',
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

  // Lista para el select de "Módulo Padre"
  const opcionesPadre = [
    { valor: '0', texto: '(Ninguno - enlace raíz)' },
    ...(datos || [])
      .filter((e) => !enlaceEditando || e.Id !== enlaceEditando.Id)
      .map((e) => ({ valor: String(e.Id), texto: e.TextoMostrar })),
  ];

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
                Crear Enlace
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
                  <th>TextoMostrar</th>
                  <th>Módulo</th>
                  <th>Padre</th>
                  <th>Ícono Módulo</th>
                  <th>Acción</th>
                  <th>Ícono Acción</th>
                  <th>Estado</th>
                  <th style={{ width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tabla.datosPaginados.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      No se encontraron enlaces
                    </td>
                  </tr>
                )}
                {tabla.datosPaginados.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.TextoMostrar}</td>
                    <td>{x.Modulo || '—'}</td>
                    <td>{x.Padre || '—'}</td>
                    <td>{x.IconoModulo || '—'}</td>
                    <td>{x.Accion || '—'}</td>
                    <td>{x.IconoAccion || '—'}</td>
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
          titulo={enlaceEditando ? 'Editar Enlace' : 'Crear Nuevo Enlace'}
          textoGuardar={enlaceEditando ? 'Guardar' : 'Crear'}
          colorGuardar={enlaceEditando ? '#1e40af' : '#16a34a'}
          campos={[
            {
              key: 'textoMostrar',
              label: 'Texto Módulo Mostrar',
              tipo: 'text',
              valor: textoMostrar,
              onChange: (e) => setTextoMostrar(e.target.value),
              placeholder: 'Texto Módulo de mostrar',
              maxLength: 50,
            },
            {
              key: 'padreId',
              label: 'Módulo Padre',
              tipo: 'select',
              valor: padreId,
              onChange: (e) => setPadreId(e.target.value),
              required: false,
              opciones: opcionesPadre,
            },
            {
              key: 'modulo',
              label: 'Módulo',
              tipo: 'text',
              valor: modulo,
              onChange: (e) => setModulo(e.target.value),
              placeholder: 'Modulo Principal',
              maxLength: 50,
            },
            {
              key: 'iconoModulo',
              label: 'Icono de Módulo',
              tipo: 'text',
              valor: iconoModulo,
              onChange: (e) => setIconoModulo(e.target.value),
              placeholder: 'Icono de Módulo Principal',
              maxLength: 40,
              required: false,
            },
            {
              key: 'accion',
              label: 'Accion',
              tipo: 'text',
              valor: accion,
              onChange: (e) => setAccion(e.target.value),
              placeholder: 'Accion',
              maxLength: 30,
            },
            {
              key: 'iconoAccion',
              label: 'Icono Accion',
              tipo: 'text',
              valor: iconoAccion,
              onChange: (e) => setIconoAccion(e.target.value),
              placeholder: 'Icono Accion',
              maxLength: 40,
              required: false,
            },
            ...(!enlaceEditando
              ? [
                  {
                    key: 'estado',
                    label: 'Estado',
                    tipo: 'checkbox',
                    valor: estadoNuevo,
                    onChange: (e) => setEstadoNuevo(e.target.checked),
                  },
                ]
              : []),
          ]}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          maxWidth="700px"
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