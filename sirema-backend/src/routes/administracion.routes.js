import { Router } from 'express';
import { obtenerResumenAdministracion } from '../controllers/administracion.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.get('/resumen', requireAuth, obtenerResumenAdministracion);
export default router;
