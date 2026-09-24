import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listarMatriculas,
  listarCentrosPermitidos,
  anularMatricula,
} from '../../api/endpoints/matriculas.js';
import { listarAniosLectivos } from '../../api/endpoints/aniosLectivos.js';
import { listarCarreras } from '../../api/endpoints/carreras.js';
import { listarTiposIngreso } from '../../api/endpoints/tiposIngreso.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import styles from './MatriculadosPage.module.css';

export function MatriculadosPage() {
  const navigate = useNavigate();
  const { session } = useSession();

  // 🎯 Permisos según rol (Opción A — por rolId)
  const rolId = session?.rolId;
  const puedeCrear = rolId === 1 || rolId === 2;   // Admin o Registrador
  const puedeAnular = rolId === 1 || rolId === 2;  // Admin o Registrador

  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [centros, setCentros] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [tiposIngreso, setTiposIngreso] = useState([]);

  const [filtroAnioLectivo, setFiltroAnioLectivo] = useState('');
  const [filtroCentro, setFiltroCentro] = useState('');
  const [filtroCarrera, setFiltroCarrera] = useState('');
  const [filtroTipoIngreso, setFiltroTipoIngreso] = useState('');

  const [datos, setDatos] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    Promise.all([
      listarAniosLectivos(),
      listarCentrosPermitidos(1),
      listarCarreras(),
      listarTiposIngreso(),
    ])
      .then(([anios, cents, cars, tipos]) => {
        setAniosLectivos(anios);
        setCentros(cents);
        setCarreras(cars);
        setTiposIngreso(tipos);
      })
      .catch(() => setError('No fue posible cargar los filtros.'));
  }, []);

  const buscar = () => {
    setBuscando(true);
    setError('');
    const filtros = {
      centroId: filtroCentro ? Number(filtroCentro) : 0,
      carreraId: filtroCarrera ? Number(filtroCarrera) : 0,
      anioLectivoId: filtroAnioLectivo ? Number(filtroAnioLectivo) : 0,
      tipoIngresoId: filtroTipoIngreso ? Number(filtroTipoIngreso) : 0,
    };
    listarMatriculas(filtros)
      .then(setDatos)
      .catch(() => setError('No fue posible cargar los registros.'))
      .finally(() => setBuscando(false));
  };

  const limpiarFiltros = () => {
    setFiltroAnioLectivo('');
    setFiltroCentro('');
    setFiltroCarrera('');
    setFiltroTipoIngreso('');
    setDatos(null);
  };

  const pedirAnular = (item) => setConfirmacion({ item });

  const cerrarConfirmacion = () => {
    if (procesando) return;
    setConfirmacion(null);
  };

  const ejecutarAnular = async () => {
    if (!confirmacion) return;
    try {
      setProcesando(true);
      await anularMatricula(confirmacion.item.Id);
      setConfirmacion(null);
      setNotificacion({
        tipo: 'exito',
        titulo: '¡Anulado!',
        mensaje: 'El registro de matrícula se anuló correctamente.',
      });
      buscar();
    } catch (err) {
      setConfirmacion(null);
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible anular el registro.',
      });
    } finally {
      setProcesando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    const d = new Date(fecha);
    return d.toLocaleString('es-NI', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.headerEyebrow}>Registros</p>
          <h1 className={styles.headerTitle}>Registro Matriculados</h1>
          <span className={styles.headerSubtitle}>Administración de Registro de Matriculados</span>
        </div>
        {/* 🎯 Solo Admin y Registrador pueden crear */}
        {puedeCrear && (
          <button
            type="button"
            onClick={() => navigate('/registros/matriculados/nuevo')}
            className={styles.btnAgregar}
          >
            Agregar Registro
          </button>
        )}
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.cardFiltros}>
        <h2 className={styles.cardFiltrosTitulo}>FILTROS PARA BUSCAR REGISTROS</h2>
        <hr className={styles.divisor} />

        <div className={styles.gridFiltros}>
          <div>
            <label className={styles.label}>Año Lectivo</label>
            <select
              value={filtroAnioLectivo}
              onChange={(e) => setFiltroAnioLectivo(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccione Año</option>
              {aniosLectivos.map((a) => (
                <option key={a.Id} value={a.Id}>{a.AnioLectivo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>Centro</label>
            <select
              value={filtroCentro}
              onChange={(e) => setFiltroCentro(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccione Centro</option>
              {centros.map((c) => (
                <option key={c.Id} value={c.Id}>
                  {c.DescripcionCentro || c.Nombre || c.Centro}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>Carrera</label>
            <select
              value={filtroCarrera}
              onChange={(e) => setFiltroCarrera(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccione Carrera</option>
              {carreras.map((c) => (
                <option key={c.Id} value={c.Id}>{c.DescripcionCarrera}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>Tipo Ingreso</label>
            <select
              value={filtroTipoIngreso}
              onChange={(e) => setFiltroTipoIngreso(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccione Tipo Ingreso</option>
              {tiposIngreso.map((t) => (
                <option key={t.Id} value={t.Id}>{t.DescripcionTipoIngreso}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.filtrosAcciones}>
          <button
            type="button"
            onClick={limpiarFiltros}
            className={styles.btnSecundario}
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={buscar}
            disabled={buscando}
            className={styles.btnBuscar}
          >
            <span className={styles.iconoBuscar}>🔍</span>
            {buscando ? 'Buscando…' : 'Buscar'}
          </button>
        </div>
      </section>

      {datos !== null && (
        <section className={styles.cardResultados}>
          <div className={styles.cardResultadosHeader}>
            <h2 className={styles.cardResultadosTitulo}>Resultados</h2>
            <span className={styles.badgeTotal}>{datos.length} registros</span>
          </div>

          {buscando && <p className={styles.loading}>Buscando registros…</p>}

          {!buscando && (
            <div className={styles.tableWrap}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Centro</th>
                    <th>Carrera</th>
                    <th>Tipo Ingreso</th>
                    <th>Semestre</th>
                    <th>Fecha Creacion</th>
                    <th>Total</th>
                    <th style={{ width: '180px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.tdVacia}>
                        No se encontraron registros con esos filtros
                      </td>
                    </tr>
                  )}
                  {datos.map((x, i) => (
                    <tr key={x.Id}>
                      <td>{i + 1}</td>
                      <td>{x.Centro}</td>
                      <td>{x.Carrera}</td>
                      <td>{x.TipoIngreso}</td>
                      <td>{x.Semestre}</td>
                      <td>{formatearFecha(x.Fecha)}</td>
                      <td>{x.Total}</td>
                      <td>
                        <div className={styles.acciones}>
                          {/* 🎯 Anular: solo Admin y Registrador */}
                          {puedeAnular && (
                            <button
                              type="button"
                              onClick={() => pedirAnular(x)}
                              title="Anular registro"
                              className={styles.btnAnular}
                            >
                              🚫
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setAviso({
                                titulo: '🚧 En desarrollo',
                                mensaje: 'La función de generar reportes estará disponible próximamente.',
                              })
                            }
                            className={styles.btnGenerar}
                          >
                            Generar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {confirmacion && (
        <ConfirmacionModal
          titulo="¿Estás seguro?"
          mensaje="El registro de matrícula se anulará."
          textoConfirmar="Sí, anular!"
          procesando={procesando}
          onConfirmar={ejecutarAnular}
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

      {aviso && (
        <NotificacionModal
          tipo="exito"
          titulo={aviso.titulo}
          mensaje={aviso.mensaje}
          onClose={() => setAviso(null)}
        />
      )}
    </main>
  );
}