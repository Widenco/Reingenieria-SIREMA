import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';

export function ProtectedRoute() {
  const { session, loading } = useSession();

  if (loading) return <p>Cargando...</p>;
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
