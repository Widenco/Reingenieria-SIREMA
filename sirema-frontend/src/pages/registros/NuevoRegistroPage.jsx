import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  crearMatricula,
  listarCentrosPermitidos,
  listarCarrerasPermitidas,
} from '../../api/endpoints/matriculas.js';
import { listarAniosLectivos } from '../../api/endpoints/aniosLectivos.js';
import { listarTiposIngreso } from '../../api/endpoints/tiposIngreso.js';
import { listarSemestres } from '../../api/endpoints/semestres.js';
import { listarAniosCarrera } from '../../api/endpoints/aniosCarrera.js';
import { listarGrupos } from '../../api/endpoints/grupos.js';
import { listarModalidades } from '../../api/endpoints/modalidades.js';
import { listarTurnos } from '../../api/endpoints/turnos.js';
import { NotificacionModal } from '../../components/modales/NotificacionModal.jsx';
import { ConfirmacionModal } from '../../components/modales/ConfirmacionModal.jsx';
import { FormularioModalDoble } from '../../components/modales/FormularioModalDoble.jsx';
import styles from './NuevoRegistroPage.module.css';

export function NuevoRegistroPage() {
  const navigate = useNavigate();

  // Catálogos
  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [centros, setCentros] = useState([]);
  const [carrerasPermitidas, setCarrerasPermitidas] = useState([]);
  const [tiposIngreso, setTiposIngreso] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [aniosCarrera, setAniosCarrera] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [turnos, setTurnos] = useState([]);

  // Cabecera
  const [anioLectivoId, setAnioLectivoId] = useState('');
  const [centroId, setCentroId] = useState('');
  const [carreraId, setCarreraId] = useState('');
  const [tipoIngresoId, setTipoIngresoId] = useState('');
  const [semestreId, setSemestreId] = useState('');

  // Fila del detalle
  const [detAnioCarrera, setDetAnioCarrera] = useState('');
  const [detGrupo, setDetGrupo] = useState('');
  const [detModalidad, setDetModalidad] = useState('');
  const [detTurno, setDetTurno] = useState('');

  // Filas agregadas
  const [detalle, setDetalle] = useState([]);

  // Modal de cantidades
  const [modalCantidades, setModalCantidades] = useState(false);
  const [femenino, setFemenino] = useState('');
  const [masculino, setMasculino] = useState('');

  // Estado general
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [errorCarrera, setErrorCarrera] = useState('');
  const [notificacion, setNotificacion] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  // Cargar todos los catálogos al montar
  useEffect(() => {
    Promise.all([
      listarAniosLectivos(),
      listarCentrosPermitidos(1),
      listarTiposIngreso(),
      listarSemestres(),
      listarAniosCarrera(),
      listarGrupos(),
      listarModalidades(),
      listarTurnos(),
    ])
      .then(([anios, cents, tipos, sems, aniosCar, grps, mods, trns]) => {
        setAniosLectivos(anios);
        setCentros(cents);
        setTiposIngreso(tipos);
        setSemestres(sems);
        setAniosCarrera(aniosCar);
        setGrupos(grps);
        setModalidades(mods);
        setTurnos(trns);
      })
      .catch(() => setError('No fue posible cargar los catálogos.'));
  }, []);

  // Cuando cambia el centro → cargar carreras permitidas
  useEffect(() => {
    if (!centroId) {
      setCarrerasPermitidas([]);
      setCarreraId('');
      setErrorCarrera('');
      return;
    }
    listarCarrerasPermitidas(centroId)
      .then((cars) => {
        setCarrerasPermitidas(cars);
        setCarreraId('');
        setErrorCarrera('');
      })
      .catch(() => setError('No fue posible cargar las carreras del centro.'));
  }, [centroId]);

  const limpiarFilaDetalle = () => {
    setDetAnioCarrera('');
    setDetGrupo('');
    setDetModalidad('');
    setDetTurno('');
  };

  // Abrir el modal de cantidades
  const abrirModalCantidades = () => {
    // Validar que la carrera esté seleccionada
    if (!carreraId) {
      setErrorCarrera('Seleccione Carrera');
      return;
    }
    setErrorCarrera('');

    // Validar los 4 selects del detalle
    if (!detAnioCarrera || !detGrupo || !detModalidad || !detTurno) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campos incompletos',
        mensaje: 'Completá Año de Carrera, Grupo, Modalidad y Turno antes de agregar.',
      });
      return;
    }

    setFemenino('');
    setMasculino('');
    setModalCantidades(true);
  };

  const cerrarModalCantidades = () => {
    if (guardando) return;
    setModalCantidades(false);
  };

  // Confirmar y agregar la fila al detalle
  const agregarFilaAlDetalle = (e) => {
    e.preventDefault();

    const fem = Number(femenino);
    const masc = Number(masculino);

    if (
      femenino === '' ||
      masculino === '' ||
      isNaN(fem) ||
      isNaN(masc) ||
      fem < 0 ||
      masc < 0
    ) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Cantidades inválidas',
        mensaje: 'Las cantidades deben ser números mayores o iguales a 0.',
      });
      return;
    }

    const anioObj = aniosCarrera.find((a) => String(a.Id) === String(detAnioCarrera));
    const grupoObj = grupos.find((g) => String(g.Id) === String(detGrupo));
    const modObj = modalidades.find((m) => String(m.Id) === String(detModalidad));
    const turnoObj = turnos.find((t) => String(t.Id) === String(detTurno));

    const nuevaFila = {
      anioCarreraId: Number(detAnioCarrera),
      modalidadId: Number(detModalidad),
      grupoId: Number(detGrupo),
      turnoId: Number(detTurno),
      femenino: fem,
      masculino: masc,
      _labelAnioCarrera: anioObj?.DescripcionAnioCarrera ?? '',
      _labelGrupo: grupoObj?.DescripcionGrupo ?? '',
      _labelModalidad: modObj?.DescripcionModalidad ?? '',
      _labelTurno: turnoObj?.DescripcionTurno ?? '',
    };

    setDetalle([...detalle, nuevaFila]);
    setModalCantidades(false);
    limpiarFilaDetalle();
  };

  const eliminarFila = (index) => {
    const nueva = detalle.filter((_, i) => i !== index);
    setDetalle(nueva);
  };

  const totalCalculado = detalle.reduce((acc, f) => acc + f.femenino + f.masculino, 0);

  // Guardar
  const guardar = async () => {
    setErrorCarrera('');

    if (!anioLectivoId || !centroId || !carreraId || !tipoIngresoId || !semestreId) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Campos incompletos',
        mensaje: 'Debe completar todos los campos de la cabecera.',
      });
      return;
    }
    if (detalle.length === 0) {
      setNotificacion({
        tipo: 'error',
        titulo: 'Sin detalles',
        mensaje: 'Debe agregar al menos una fila de detalle.',
      });
      return;
    }

    setConfirmacion({ tipo: 'guardar' });
  };

  const ejecutarGuardar = async () => {
    try {
      setGuardando(true);
      const payload = {
        centroId: Number(centroId),
        carreraId: Number(carreraId),
        tipoIngresoId: Number(tipoIngresoId),
        semestreId: Number(semestreId),
        anioLectivoId: Number(anioLectivoId),
        total: totalCalculado,
        detalle: detalle.map((f) => ({
          anioCarreraId: f.anioCarreraId,
          modalidadId: f.modalidadId,
          grupoId: f.grupoId,
          turnoId: f.turnoId,
          femenino: f.femenino,
          masculino: f.masculino,
        })),
      };

      await crearMatricula(payload);
      setConfirmacion(null);
      setNotificacion({
        tipo: 'exito',
        titulo: '¡Guardado!',
        mensaje: 'El registro de matrícula se creó exitosamente.',
      });
      setTimeout(() => navigate('/registros/matriculados'), 1500);
    } catch (err) {
      setConfirmacion(null);
      setNotificacion({
        tipo: 'error',
        titulo: 'Error',
        mensaje: err?.response?.data?.error || 'No fue posible guardar el registro.',
      });
    } finally {
      setGuardando(false);
    }
  };

  const carreraSeleccionada = carrerasPermitidas.find(
    (c) => String(c.Id) === String(carreraId)
  );

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <p className={styles.headerEyebrow}>Registros</p>
          <h1 className={styles.headerTitle}>Matriculados</h1>
          <span className={styles.headerSubtitle}>Nuevo Registro</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/registros/matriculados')}
          className={styles.btnRegresar}
        >
          Regresar
        </button>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {/* Card de cabecera */}
      <section className={styles.card}>
        <div className={styles.gridCabecera}>
          <div>
            <label className={styles.label}>Año Lectivo</label>
            <select
              value={anioLectivoId}
              onChange={(e) => setAnioLectivoId(e.target.value)}
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
              value={centroId}
              onChange={(e) => setCentroId(e.target.value)}
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
              value={carreraId}
              onChange={(e) => {
                setCarreraId(e.target.value);
                setErrorCarrera('');
              }}
              className={styles.select}
              style={
                errorCarrera
                  ? { borderColor: '#dc2626', boxShadow: '0 0 0 3px rgba(220,38,38,0.1)' }
                  : undefined
              }
              disabled={!centroId}
            >
              <option value="">
                {centroId ? 'Seleccione Carrera' : 'Primero elija un centro'}
              </option>
              {carrerasPermitidas.map((c) => (
                <option key={c.Id} value={c.Id}>
                  {c.DescripcionCarrera || c.carrera || c.Nombre}
                </option>
              ))}
            </select>
            {errorCarrera && (
              <span
                style={{
                  display: 'block',
                  marginTop: '0.35rem',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {errorCarrera}
              </span>
            )}
          </div>
          <div>
            <label className={styles.label}>Tipo de Ingreso</label>
            <select
              value={tipoIngresoId}
              onChange={(e) => setTipoIngresoId(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccione Tipo Ingreso</option>
              {tiposIngreso.map((t) => (
                <option key={t.Id} value={t.Id}>{t.DescripcionTipoIngreso}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>Semestre</label>
            <select
              value={semestreId}
              onChange={(e) => setSemestreId(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccione Semestre</option>
              {semestres.map((s) => (
                <option key={s.Id} value={s.Id}>{s.DescripcionSemestre}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Card de detalle */}
      <section className={styles.card}>
        <h2 className={styles.tituloSeccion}>Detalle de Matriculado</h2>

        <div className={styles.filaAgregar}>
          <div>
            <label className={styles.labelAzul}>Año de Carrera</label>
            <select
              value={detAnioCarrera}
              onChange={(e) => setDetAnioCarrera(e.target.value)}
              className={styles.selectBlanco}
            >
              <option value="">Seleccione</option>
              {aniosCarrera.map((a) => (
                <option key={a.Id} value={a.Id}>{a.DescripcionAnioCarrera}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.labelAzul}>Grupo</label>
            <select
              value={detGrupo}
              onChange={(e) => setDetGrupo(e.target.value)}
              className={styles.selectBlanco}
            >
              <option value="">Seleccione</option>
              {grupos.map((g) => (
                <option key={g.Id} value={g.Id}>{g.DescripcionGrupo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.labelAzul}>Modalidad</label>
            <select
              value={detModalidad}
              onChange={(e) => setDetModalidad(e.target.value)}
              className={styles.selectBlanco}
            >
              <option value="">Seleccione</option>
              {modalidades.map((m) => (
                <option key={m.Id} value={m.Id}>{m.DescripcionModalidad}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.labelAzul}>Turno</label>
            <select
              value={detTurno}
              onChange={(e) => setDetTurno(e.target.value)}
              className={styles.selectBlanco}
            >
              <option value="">Seleccione</option>
              {turnos.map((t) => (
                <option key={t.Id} value={t.Id}>{t.DescripcionTurno}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="button" onClick={abrirModalCantidades} className={styles.btnAgregarFila}>
              ＋ Agregar
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Carrera</th>
                <th>Año Carrera</th>
                <th>Grupo</th>
                <th>Turno</th>
                <th>Cant. Femenino</th>
                <th>Cant. Masculino</th>
                <th style={{ width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {detalle.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.tdVacia}>
                    Aún no ha agregado filas al detalle
                  </td>
                </tr>
              )}
              {detalle.map((fila, i) => (
                <tr key={i}>
                  <td>{carreraSeleccionada?.DescripcionCarrera ?? '—'}</td>
                  <td>{fila._labelAnioCarrera}</td>
                  <td>{fila._labelGrupo}</td>
                  <td>{fila._labelTurno}</td>
                  <td>{fila.femenino}</td>
                  <td>{fila.masculino}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => eliminarFila(i)}
                      className={styles.btnEliminarFila}
                      title="Quitar fila"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pieDetalle}>
          <div className={styles.totalBox}>
            <span>Total:</span>
            <strong>{totalCalculado}</strong>
          </div>
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className={styles.btnGuardar}
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </section>

      {/* Modal de cantidades */}
      {modalCantidades && (
        <FormularioModalDoble
          titulo="Cantidad de Estudiantes"
          label1="Cantidad Femenino"
          valor1={femenino}
          onChange1={(e) => setFemenino(e.target.value.replace(/\D/g, ''))}
          placeholder1="Ej: 10"
          maxLength1={4}
          label2="Cantidad Masculino"
          valor2={masculino}
          onChange2={(e) => setMasculino(e.target.value.replace(/\D/g, ''))}
          placeholder2="Ej: 15"
          maxLength2={4}
          onSubmit={agregarFilaAlDetalle}
          onCancel={cerrarModalCantidades}
          guardando={false}
        />
      )}

      {/* Confirmación de guardar */}
      {confirmacion && (
        <ConfirmacionModal
          titulo="¿Estás seguro?"
          mensaje="Se guardará el registro de matrícula con todos sus detalles."
          textoConfirmar="Sí, guardar!"
          procesando={guardando}
          onConfirmar={ejecutarGuardar}
          onCancelar={() => !guardando && setConfirmacion(null)}
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