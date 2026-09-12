import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login, obtenerSesion } from '../../api/endpoints/auth.js';
import { useSession } from '../../context/SessionContext.jsx';
import styles from './Login.module.css';

const schema = z.object({
  nombreUsuario: z.string().email(),
  clave: z.string().min(1, 'Requerido'),
});

export function Login() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await login(data.nombreUsuario, data.clave);

      // La cookie de sesiÃ³n ya fue creada por /auth/login. Cargamos la sesiÃ³n
      // completa antes de navegar para que ProtectedRoute no redirija de vuelta.
      const session = await obtenerSesion();
      setSession(session);
      navigate('/', { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.error
          || 'No fue posible iniciar sesion. Verifica que el servidor esta activo.'
      );
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <header className={styles.header}>
          <p className={styles.systemName}>Sistema de Matriculados</p>
          <div className={styles.divider} />
          <h1 id="login-title">Iniciar sesión</h1>
          <p className={styles.subtitle}>Ingresa tus credenciales para continuar.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.field}>
            <label htmlFor="nombreUsuario">Correo</label>
            <input
              id="nombreUsuario"
              type="email"
              autoComplete="username"
              placeholder="johndow@gmail.com"
              aria-invalid={Boolean(errors.nombreUsuario)}
              {...register('nombreUsuario')}
            />
            {errors.nombreUsuario && <p className={styles.fieldError}>{errors.nombreUsuario.message}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="clave">Contraseña</label>
            <input
              id="clave"
              type="password"
              autoComplete="current-password"
              placeholder="Sirema2026!"
              aria-invalid={Boolean(errors.clave)}
              {...register('clave')}
            />
            {errors.clave && <p className={styles.fieldError}>{errors.clave.message}</p>}
          </div>

          {serverError && <p className={styles.serverError} role="alert">{serverError}</p>}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Verificando…' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  );
}
