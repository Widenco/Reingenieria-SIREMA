import { useEffect, useState } from 'react';
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
} from '../../api/endpoints/usuarios.js';
import { listarCentros } from '../../api/endpoints/centros.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModalMulti } from '../../components/modales/FormularioModalMulti.jsx';
import { BarraTabla } from '../../components/tabla/BarraTabla.jsx';
import { Paginacion } from '../../components/tabla/Paginacion.jsx';
import { useTabla } from '../../hooks/useTabla.js';
import styles from './AdministracionPage.module.css';

// Roles reales de la BD (SELECT * FROM roles)
const ROLES = [
  { Id: 1, Nombre: 'Administrador' },
  { Id: 2, Nombre: 'Registrador' },
  { Id: 3, Nombre: 'Consulta' },
];

export function UsuariosPage() {
  const [datos, setDatos] = useState(null);
  const [centros, setCentros] = useState([]);
  const [error, setError] = useState('');

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [rolId, setRolId] = useState('');
  const [centroId, setCentroId] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Confirmación + notificación
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Hook de tabla
  const tabla = useTabla(datos, {
    campoBusqueda: 'NombreUsuario',
    porPaginaInicial: 10,
  });

  const cargar = () => {
    listarUsuarios()
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los usuarios.'));
  };

  const cargarCentros = () => {
    listarCentros()
      .then(setCentros)
      .catch(() => setError('No fue posible cargar los centros.'));
  };

  useEffect(() => {
    cargar();
    cargarCentros();
  }, []);

  const abrirCrear = () => {
    setUsuarioEditando(null);
    setNombreUsuario('');
    setClave('');
    setRolId('');
    setCentroId('');
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setUsuarioEditando(item);
    setNombreUsuario(item.NombreUsuario || '');
    setClave('');
    setRolId(item.Rol_Id ? String(item.Rol_Id) : '');
    setCentroId('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const guardar = async (e) => {
    e.preventDefault();

    // Validar email
    if (!nombreUsuario.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'El correo es obligatorio.',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nombreUsuario.trim())) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Correo inválido',
        mensaje: 'Debe ser un correo institucional válido.',
      });
      return;
    }

    // Validar clave
    if (!usuarioEditando && !clave.trim()) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'La contraseña es obligatoria al crear un usuario.',
      });
      return;
    }
    if (clave && clave.length < 8) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Contraseña muy corta',
        mensaje: 'La contraseña debe tener al menos 8 caracteres.',
      });
      return;
    }

    // Validar rol
    if (!rolId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar un rol.',
      });
      return;
    }

    // Validar centro
    if (!centroId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campo obligatorio',
        mensaje: 'Debe seleccionar un centro.',
      });
      return;
    }

    const payload = {
      nombreUsuario: nombreUsuario.trim(),
      centroId: Number(centroId),
      rolId: Number(rolId),
    };

    if (clave) {
      payload.clave = clave;
    }

    try {
      setGuardando(true);
      if (usuarioEditando) {
        await actualizarUsuario(usuarioEditando.Id, payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Usuario ha sido actualizado exitosamente.',
        });
      } else {
        await crearUsuario(payload);
        setNotificacion({
          tipo: 'exito',
          titulo: '¡Guardado!',
          mensaje: 'El Usuario ha sido creado exitosamente.',
        });
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el usuario.',
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
      await cambiarEstadoUsuario(confirmacion.item.Id);
      setConfirmacion(null);
      setNotificacion({
        tipo: 'exito',
        titulo: '¡Guardado!',
        mensaje: 'El estado del usuario se actualizó correctamente.',
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

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-NI');
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Administración</p>
        <h1>Usuarios</h1>
        <span>Usuarios registrados en el sistema.</span>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!datos && !error && <p className={styles.loading}>Cargando información…</p>}

      {datos && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Usuarios</h2>
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
                Crear Usuario
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
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Centro</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th style={{ width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tabla.datosPaginados.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
                {tabla.datosPaginados.map((x) => (
                  <tr key={x.Id}>
                    <td>{x.NombreUsuario}</td>
                    <td>{x.Rol || ROLES.find((r) => r.Id === x.Rol_Id)?.Nombre || '—'}</td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '300px' }}>
                      {x.Centro || '—'}
                    </td>
                    <td>
                      <span className={x.Estado ? styles.active : styles.inactive}>
                        {x.Estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{formatearFecha(x.FechaCreacion)}</td>
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
          titulo={usuarioEditando ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          textoGuardar={usuarioEditando ? 'Guardar' : 'Crear'}
          colorGuardar={usuarioEditando ? '#1e40af' : '#16a34a'}
          campos={[
            {
              key: 'nombreUsuario',
              label: 'Correo Institucional',
              tipo: 'text',
              valor: nombreUsuario,
              onChange: (e) => setNombreUsuario(e.target.value),
              placeholder: 'ejemplo@bicu.edu.ni',
              maxLength: 150,
              ancho: 'completo',
            },
            {
              key: 'clave',
              label: usuarioEditando ? 'Contraseña (opcional)' : 'Contraseña',
              tipo: 'text',
              valor: clave,
              onChange: (e) => setClave(e.target.value),
              placeholder: usuarioEditando
                ? 'Dejar en blanco para no cambiar'
                : 'Mínimo 8 caracteres',
              maxLength: 100,
              ancho: 'completo',
              required: !usuarioEditando,
            },
            {
              key: 'rolId',
              label: 'Rol',
              tipo: 'select',
              valor: rolId,
              onChange: (e) => setRolId(e.target.value),
              opciones: [
                { valor: '', texto: 'Seleccione un rol' },
                ...ROLES.map((r) => ({ valor: String(r.Id), texto: r.Nombre })),
              ],
            },
            {
              key: 'centroId',
              label: 'Centro',
              tipo: 'select',
              valor: centroId,
              onChange: (e) => setCentroId(e.target.value),
              opciones: [
                {
                  valor: '',
                  texto: usuarioEditando
                    ? 'Seleccione un centro (obligatorio)'
                    : 'Seleccione un centro',
                },
                ...centros.map((c) => ({
                  valor: String(c.Id),
                  texto: c.DescripcionCentro || c.Nombre || c.Centro,
                })),
              ],
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