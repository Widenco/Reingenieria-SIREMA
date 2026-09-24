import { useEffect, useState } from 'react';
import {
  listarCentros,
  crearCentro,
  actualizarCentro,
  cambiarEstadoCentro,
} from '../../api/endpoints/centros.js';
import { listarTiposCentro } from '../../api/endpoints/tiposCentro.js';
import { listarComunidades } from '../../api/endpoints/comunidades.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModalMulti } from '../../components/modales/FormularioModalMulti.jsx';
import { BarraTabla } from '../../components/tabla/BarraTabla.jsx';
import { Paginacion } from '../../components/tabla/Paginacion.jsx';
import { useTabla } from '../../hooks/useTabla.js';
import styles from '../administracion/AdministracionPage.module.css';

export function CentrosPage() {
  const [datos, setDatos] = useState(null);
  const [tiposCentro, setTiposCentro] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [centroEditando, setCentroEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [tipoCentroId, setTipoCentroId] = useState('');
  const [comunidadId, setComunidadId] = useState('');
  const [padreId, setPadreId] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const [notificacion, setNotificacion] = useState(null);

  // 🎯 Hook de tabla
  const tabla = useTabla(datos, {
    campoBusqueda: 'DescripcionCentro',
    porPaginaInicial: 10,
  });

  const cargar = () => {
    listarCentros()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los centros.'));
  };

  const cargarTiposCentro = () => {
    listarTiposCentro()
      .then(setTiposCentro)
      .catch(() => setError('No fue posible cargar los tipos de centro.'));
  };

  const cargarComunidades = () => {
    listarComunidades()
      .then(setComunidades)
      .catch(() => setError('No fue posible cargar las comunidades.'));
  };

  useEffect(() => {
    cargar();
    cargarTiposCentro();
    cargarComunidades();
  }, []);

  const abrirCrear = () => {
    setCentroEditando(null);
    setDescripcion('');
    setTipoCentroId('');
    setComunidadId('');
    setPadreId('0');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setCentroEditando(item);
    setDescripcion(item.DescripcionCentro);

    const tipoEncontrado = tiposCentro.find((t) => t.DescripcionTipoCentro === item.DescripcionTipoCentro);
    setTipoCentroId(tipoEncontrado ? String(tipoEncontrado.Id) : '');

    const comEncontrada = comunidades.find((c) => c.DescripcionComunidad === item.DescripcionComunidad);
    setComunidadId(comEncontrada ? String(comEncontrada.Id) : '');

    setPadreId(item.Padre_Id ? String(item.Padre_Id) : '0');

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setCentroEditando(null);
    setDescripcion('');
    setTipoCentroId('');
    setComunidadId('');
    setPadreId('');
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

    if (!tipoCentroId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar un tipo de centro.',
      });
      return;
    }

    if (!comunidadId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar una comunidad.',
      });
      return;
    }

    const payload = {
      descripcion: descripcion.trim(),
      tipoCentroId: Number(tipoCentroId),
      comunidadId: Number(comunidadId),
      padreId: padreId ? Number(padreId) : 0,
    };

    try {
      setGuardando(true);
      if (centroEditando) {
        await actualizarCentro(centroEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Centro ha sido actualizado exitosamente.',
        });
      } else {
        await crearCentro(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Centro ha sido creado exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el centro.',
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
      await cambiarEstadoCentro(confirmacion.item.Id);
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
        <h1>Centros</h1>
        <span>Centros registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Centros</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>{tabla.totalFiltrado} registros</span>
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
                + Nuevo Centro
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
                  <th>Centro</th>
                  <th>Tipo</th>
                  <th>Comunidad</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tabla.datosPaginados.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
                {tabla.datosPaginados.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionCentro}</td>
                    <td>{x.DescripcionTipoCentro || '—'}</td>
                    <td>{x.DescripcionComunidad || '—'}</td>
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
          titulo={centroEditando ? 'Editar Centro' : 'Nuevo Centro'}
          campos={[
            {
              key: 'descripcion',
              label: 'Descripción',
              tipo: 'text',
              valor: descripcion,
              onChange: (e) => setDescripcion(e.target.value),
              placeholder: 'Ej: Bluefields',
              maxLength: 240,
            },
            {
              key: 'tipoCentroId',
              label: 'Tipo de Centro',
              tipo: 'select',
              valor: tipoCentroId,
              onChange: (e) => setTipoCentroId(e.target.value),
              opciones: [
                { valor: '', texto: 'Seleccioná un tipo' },
                ...tiposCentro.map((t) => ({ valor: String(t.Id), texto: t.DescripcionTipoCentro })),
              ],
            },
            {
              key: 'comunidadId',
              label: 'Comunidad',
              tipo: 'select',
              valor: comunidadId,
              onChange: (e) => setComunidadId(e.target.value),
              opciones: [
                { valor: '', texto: 'Seleccioná una comunidad' },
                ...comunidades.map((c) => ({ valor: String(c.Id), texto: c.DescripcionComunidad })),
              ],
            },
            {
              key: 'padreId',
              label: 'Centro Padre',
              tipo: 'select',
              valor: padreId,
              onChange: (e) => setPadreId(e.target.value),
              required: false,
              opciones: [
                { valor: '0', texto: '(Ninguno - es un centro principal)' },
                ...(datos || [])
                  .filter((c) => !centroEditando || c.Id !== centroEditando.Id)
                  .map((c) => ({ valor: String(c.Id), texto: c.DescripcionCentro })),
              ],
            },
          ]}
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