import { createContext, useContext, useEffect, useState } from 'react';
import { obtenerSesion } from '../api/endpoints/auth.js';

// Reemplaza $_SESSION['funciones_validos'] / $_SESSION['usuario'] del sistema
// original. Se carga una sola vez al montar la app y queda disponible
// para el Sidebar, las rutas protegidas y cualquier vista que lo necesite.

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerSesion()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider');
  return ctx;
}
