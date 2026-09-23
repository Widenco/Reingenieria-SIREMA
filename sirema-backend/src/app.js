import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";

import { validarEnv } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import enlacesRoutes from "./routes/enlaces.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import carreraCentroRoutes from "./routes/carreraCentro.routes.js";
import funcionRoutes from "./routes/funcion.routes.js";
import municipioRoutes from "./routes/municipio.routes.js";
import comunidadRoutes from "./routes/comunidad.routes.js";
import tipoCentroRoutes from "./routes/tipoCentro.routes.js";
import centroRoutes from "./routes/centro.routes.js";
import etniaRoutes from "./routes/etnia.routes.js";
import anioCarreraRoutes from "./routes/anioCarrera.routes.js";
import anioLectivoRoutes from "./routes/anioLectivo.routes.js";
import areaConocimientoRoutes from "./routes/areaConocimiento.routes.js";
import carreraRoutes from "./routes/carrera.routes.js";
import semestreRoutes from "./routes/semestre.routes.js";
import tipoIngresoRoutes from "./routes/tipoIngreso.routes.js";
import administracionRoutes from "./routes/administracion.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

validarEnv();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// NOTA: MemoryStore (el store por defecto) es suficiente para desarrollo
// y para el alcance de este proyecto de curso, pero pierde todas las
// sesiones si el servidor se reinicia y no funciona si algún día corren
// más de un proceso de Node. Si eso llega a ser un problema, la solución
// es agregar connect-session-knex o connect-redis como store.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000, // 8 horas, equivalente a session.gc_maxlifetime en PHP
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/enlaces", enlacesRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/carreras-centro", carreraCentroRoutes);
app.use("/api/funciones", funcionRoutes);
app.use("/api/municipios", municipioRoutes);
app.use("/api/comunidades", comunidadRoutes);
app.use("/api/administracion", administracionRoutes);
app.use("/api/tipos-centro", tipoCentroRoutes);
app.use("/api/centros", centroRoutes);
app.use("/api/etnias", etniaRoutes);
app.use("/api/anios-carrera", anioCarreraRoutes);
app.use("/api/anios-lectivo", anioLectivoRoutes);
app.use("/api/areas-conocimiento", areaConocimientoRoutes);
app.use("/api/carreras", carreraRoutes);
app.use("/api/semestres", semestreRoutes);
app.use("/api/tipos-ingreso", tipoIngresoRoutes);
// app.use('/api/roles', rolesRoutes);
// app.use('/api/matricula', matriculaRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API SIREMA escuchando en puerto ${PORT}`));
