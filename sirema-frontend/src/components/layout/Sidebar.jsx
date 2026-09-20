import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/endpoints/auth.js';
import { useSession } from '../../context/SessionContext.jsx';
import styles from './Sidebar.module.css';

const enlacesAdministracion = [
  ['/administracion/enlaces', 'Enlaces'], ['/administracion/usuarios', 'Usuarios'],
  ['/administracion/carreras-centro', 'Carreras Centro'], ['/administracion/funciones', 'Funciones'],
];
const enlacesCatalogos = [
  ['tiposCentro', 'Tipo de Centro'], ['centros', 'Centro'], ['comunidades', 'Comunidad'], ['municipios', 'Municipio'],
  ['areas', 'Áreas del Conocimiento'], ['carreras', 'Carreras'], ['modalidades', 'Modalidades'], ['tiposIngreso', 'Tipos de Ingreso'],
  ['semestres', 'Semestres'], ['aniosLectivos', 'Años Lectivos'], ['etnias', 'Etnias'],
];

export function Sidebar() {
  const navigate = useNavigate(); const { session, setSession } = useSession();
  const [administracionAbierta, setAdministracionAbierta] = useState(true); const [catalogosAbiertos, setCatalogosAbiertos] = useState(false); const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const cerrarSesion = async () => { setCerrandoSesion(true); try { await logout(); } finally { setSession(null); navigate('/login', { replace: true }); } };
  const grupo = (titulo, abierto, cambiarAbierto, icono, enlaces, catalogos = false) => <>
    <button className={styles.groupButton} type="button" onClick={() => cambiarAbierto((valor) => !valor)} aria-expanded={abierto}><span className={styles.groupLabel}><span className={styles.icon} aria-hidden="true">{icono}</span>{titulo}</span><span className={styles.caret} aria-hidden="true">⌄</span></button>
    {abierto && <div className={styles.submenu}>{enlaces.map(([ruta, texto]) => <Link className={styles.sublink} to={catalogos ? `/catalogos?seleccion=${ruta}` : ruta} key={texto}><span aria-hidden="true">●</span>{texto}</Link>)}</div>}
  </>;
  return <aside className={styles.sidebar}>
    <div className={styles.brand}><Link className={styles.brandLink} to="/" aria-label="Ir al inicio de SIREMA"><img src="/bicu.png" alt="BICU" /><span>SIREMA</span></Link></div>
    <nav className={styles.navigation} aria-label="Navegación principal"><p className={styles.sectionTitle}>MENÚ</p><Link className={styles.link} to="/"><span className={styles.icon} aria-hidden="true">⌂</span><span>Inicio</span></Link>{grupo('Administración', administracionAbierta, setAdministracionAbierta, '⚙', enlacesAdministracion)}{grupo('Catálogos', catalogosAbiertos, setCatalogosAbiertos, '▦', enlacesCatalogos, true)}</nav>
    <div className={styles.profile}><div className={styles.avatar} aria-hidden="true">{session?.usuarioId ?? 'S'}</div><div className={styles.profileText}><span>Sesión activa</span><strong>{session?.rolId === 1 ? 'Administrador' : 'Usuario'}</strong></div><button className={styles.logout} type="button" onClick={cerrarSesion} disabled={cerrandoSesion} title="Cerrar sesión"><span aria-hidden="true">↪</span><span>{cerrandoSesion ? 'Saliendo…' : 'Salir'}</span></button></div>
  </aside>;
}
