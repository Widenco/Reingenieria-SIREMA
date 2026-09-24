import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Home } from '../pages/Home.jsx';
import { EnlacesPage } from '../pages/administracion/EnlacesPage.jsx';
import { UsuariosPage } from '../pages/administracion/UsuariosPage.jsx';
import { CarrerasCentroPage } from '../pages/administracion/CarrerasCentroPage.jsx';
import { FuncionesPage } from '../pages/administracion/FuncionesPage.jsx';
import { TiposCentroPage } from '../pages/catalogos/TiposCentroPage.jsx';
import { CentrosPage } from '../pages/catalogos/CentrosPage.jsx';
import { ComunidadesPage } from '../pages/catalogos/ComunidadesPage.jsx';
import { MunicipiosPage } from '../pages/catalogos/MunicipiosPage.jsx';
import { EtniasPage } from '../pages/catalogos/EtniasPage.jsx';
import { AreasConocimientoPage } from '../pages/catalogos-educacion/AreasConocimientoPage.jsx';
import { CarrerasPage } from '../pages/catalogos-educacion/CarrerasPage.jsx';
import { ModalidadesPage } from '../pages/catalogos-educacion/ModalidadesPage.jsx';
import { TiposIngresoPage } from '../pages/catalogos-educacion/TiposIngresoPage.jsx';
import { SemestresPage } from '../pages/catalogos-educacion/SemestresPage.jsx';
import { AniosCarreraPage } from '../pages/catalogos-educacion/AniosCarreraPage.jsx';
import { AniosLectivosPage } from '../pages/catalogos-educacion/AniosLectivosPage.jsx';
import { TurnosPage } from '../pages/catalogos-educacion/TurnosPage.jsx';
import { GruposPage } from '../pages/catalogos-educacion/GruposPage.jsx';
import { TiposModalidadPage } from '../pages/catalogos-educacion/TiposModalidadPage.jsx';


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />

          {/* Administración */}
          <Route path="/administracion/enlaces" element={<EnlacesPage />} />
          <Route path="/administracion/usuarios" element={<UsuariosPage />} />
          <Route path="/administracion/carreras-centro" element={<CarrerasCentroPage />} />
          <Route path="/administracion/funciones" element={<FuncionesPage />} />

          {/* Catálogos */}
          <Route path="/catalogos/tipos-centro" element={<TiposCentroPage />} />
          <Route path="/catalogos/centros" element={<CentrosPage />} />
          <Route path="/catalogos/comunidades" element={<ComunidadesPage />} />
          <Route path="/catalogos/municipios" element={<MunicipiosPage />} />
          <Route path="/catalogos/etnias" element={<EtniasPage />} />

          {/* Catálogos Educación */}
          <Route path="/catalogos-educacion/carrera-centro" element={<CarrerasCentroPage />} />
          <Route path="/catalogos-educacion/areas" element={<AreasConocimientoPage />} />
          <Route path="/catalogos-educacion/carreras" element={<CarrerasPage />} />
          <Route path="/catalogos-educacion/modalidades" element={<ModalidadesPage />} />
          <Route path="/catalogos-educacion/tipos-ingreso" element={<TiposIngresoPage />} />
          <Route path="/catalogos-educacion/semestres" element={<SemestresPage />} />
          <Route path="/catalogos-educacion/anios-carrera" element={<AniosCarreraPage />} />
          <Route path="/catalogos-educacion/anios-lectivos" element={<AniosLectivosPage />} />
          <Route path="/catalogos-educacion/turnos" element={<TurnosPage />} />
          <Route path="/catalogos-educacion/grupos" element={<GruposPage />} />
          <Route path="/catalogos-educacion/tipos-modalidad" element={<TiposModalidadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}