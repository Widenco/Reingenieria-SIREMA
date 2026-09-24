import { useEffect, useState } from 'react';
import {
  listarComunidades,
  crearComunidad,
  actualizarComunidad,
  cambiarEstadoComunidad,
} from '../../api/endpoints/comunidades.js';
import { listarMunicipios } from '../../api/endpoints/municipios.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModal } from '../../components/modales/FormularioModal.jsx';
import { BarraTabla } from '../../components/tabla/BarraTabla.jsx';
import { Paginacion } from '../../components/tabla/Paginacion.jsx';
import { useTabla } from '../../hooks/useTabla.js';
import styles from '../administracion/AdministracionPage.module.css';

export function ComunidadesPage() {
  const [datos, setDatos] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [comunidadEditando, setComunidadEditando] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [municipioId, setMunicipioId] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);

  const [notificacion, setNotificacion] = useState(null);

  // 🎯 Hook de tabla: búsqueda + paginación
  const tabla = useTabla(datos, {
    campoBusqueda: 'DescripcionComunidad',
    porPaginaInicial: 10,
  });

  const cargar = () => {
    listarComunidades()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar las comunidades.'));
  };

  const cargarMunicipios = () => {
    listarMunicipios()
      .then(setMunicipios)
      .catch(() => setError('No fue posible cargar los municipios.'));
  };

  useEffect(() => {
    cargar();
    cargarMunicipios();
  }, []);

  const abrirCrear = () => {
    setComunidadEditando(null);
    setDescripcion('');
    setMunicipioId('');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setComunidadEditando(item);
    setDescripcion(item.DescripcionComunidad);
    const muniEncontrado = municipios.find((m) => m.DescripcionMunicipio === item.Municipio);
    setMunicipioId(muniEncontrado ? String(muniEncontrado.Id) : '');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setComunidadEditando(null);
    setDescripcion('');
    setMunicipioId('');
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

    if (!municipioId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar un municipio.',
      });
      return;
    }

    const payload = {
      descripcion: descripcion.trim(),
      municipioId: Number(municipioId),
    };

    try {
      setGuardando(true);
      if (comunidadEditando) {
        await actualizarComunidad(comunidadEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Comunidad ha sido actualizada exitosamente.',
        });
      } else {
        await crearComunidad(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'La Comunidad ha sido creada exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar la comunidad.',
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
      await cambiarEstadoComunidad(confirmacion.item.Id);
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
        <h1>Comunidades</h1>
        <span>Comunidades registradas en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Comunidades</h2>
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
                + Nueva Comunidad
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
                  <th>Comunidad</th>
                  <th>Municipio</th>
                  <th>Estado</th>
                  <th style={{ width: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tabla.datosPaginados.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
                {tabla.datosPaginados.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.DescripcionComunidad}</td>
                    <td>{x.Municipio || '—'}</td>
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
        <FormularioModal
          titulo={comunidadEditando ? 'Editar Comunidad' : 'Nueva Comunidad'}
          label="Descripción"
          valor={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onSubmit={guardar}
          onCancel={cerrarModal}
          guardando={guardando}
          placeholder="Ej: Bluefields"
          maxLength={140}
          extraField={
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Municipio
              </label>
              <select
                value={municipioId}
                onChange={(e) => setMunicipioId(e.target.value)}
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
                <option value="">Seleccioná un municipio</option>
                {municipios.map((m) => (
                  <option key={m.Id} value={m.Id}>
                    {m.DescripcionMunicipio}
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