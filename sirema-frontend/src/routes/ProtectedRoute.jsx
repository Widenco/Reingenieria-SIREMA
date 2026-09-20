import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import styles from '../components/layout/ProtectedLayout.module.css';

export function ProtectedRoute() {
  const { session, loading } = useSession();

  if (loading) return <p>Cargando...</p>;
  if (!session) return <Navigate to="/login" replace />;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}><Outlet /></div>
    </div>
  );
}
