import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Home } from '../pages/Home.jsx';
import { AdministracionPage } from '../pages/administracion/AdministracionPage.jsx';
import { CatalogosPage } from '../pages/catalogos/CatalogosPage.jsx';
// import { RolesPage } from '../pages/admin/RolesPage.jsx';
// import { MatriculaList } from '../pages/matricula/MatriculaList.jsx';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/administracion/enlaces" element={<AdministracionPage seccion="enlaces" />} />
          <Route path="/administracion/usuarios" element={<AdministracionPage seccion="usuarios" />} />
          <Route path="/administracion/carreras-centro" element={<AdministracionPage seccion="carreras-centro" />} />
          <Route path="/administracion/funciones" element={<AdministracionPage seccion="funciones" />} />
          <Route path="/catalogos" element={<CatalogosPage />} />
          {/* <Route path="/admin/roles" element={<RolesPage />} /> */}
          {/* <Route path="/matricula" element={<MatriculaList />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
