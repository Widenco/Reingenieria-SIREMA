import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Home } from '../pages/Home.jsx';
// import { RolesPage } from '../pages/admin/RolesPage.jsx';
// import { MatriculaList } from '../pages/matricula/MatriculaList.jsx';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/admin/roles" element={<RolesPage />} /> */}
          {/* <Route path="/matricula" element={<MatriculaList />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
