import { useSession } from '../../context/SessionContext.jsx';

// Reemplaza la lógica que en el sistema original arma el menú leyendo
// menu_usuario por cada usuario individual. Aquí el menú ya viene resuelto
// por rol_menu, incluido en la respuesta de /auth/me.
export function Sidebar() {
  const { session } = useSession();

  if (!session?.menu) return null;

  return (
    <nav>
      <ul>
        {session.menu.map((item) => (
          <li key={item.Id}>{item.TextoMostrar}</li>
        ))}
      </ul>
    </nav>
  );
}
