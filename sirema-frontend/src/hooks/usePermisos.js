import { useSession } from '../context/SessionContext.jsx';

/**
 * Hook para verificar permisos según el rol del usuario.
 * 
 * Rol 1 = Administrador → todos los permisos
 * Rol 2 = Registrador → solo ver
 * Rol 3 = Consulta → solo ver
 */
export function usePermisos() {
  const { session } = useSession();
  const rolId = session?.rolId;

  return {
    rolId,
    esAdmin: rolId === 1,
    puedeCrear: rolId === 1,
    puedeEditar: rolId === 1,
    puedeCambiarEstado: rolId === 1,
  };
}