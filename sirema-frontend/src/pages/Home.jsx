import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.welcome}>
        <p className={styles.eyebrow}>Sistema de Matriculados</p>
        <h1>Bienvenido a SIREMA</h1>
        <p>Selecciona una opción del menú lateral para administrar la información del sistema.</p>
        <div className={styles.actions}>
          <Link to="/administracion/usuarios">Ver usuarios</Link>
          <Link to="/catalogos">Ver catálogos</Link>
        </div>
      </section>
    </main>
  );
}
