import { useSession } from '../context/SessionContext.jsx';

// Página temporal SOLO para verificar que el login + /auth/me funcionan.
// Bórrala (o reemplázala por el layout real) cuando ya tengan páginas de
// dominio de verdad.
export function Home() {
  const { session } = useSession();

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>Sesión activa ✅</h1>
      <p>Si ves esto, el login y /auth/me funcionaron correctamente.</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
