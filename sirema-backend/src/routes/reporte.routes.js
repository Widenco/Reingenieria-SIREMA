import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/reporte.controller.js';

const router = Router();

// El sistema original solo protegía 1 de los 7 reportes (CONSOBICCEN, en
// reporteConsolidadoBicuCnu.php); el resto no tenía ningún permiso. Se
// decidió proteger los 10 endpoints con un único acronimo REPIN, ya que
// todos son de solo lectura dentro de la misma área funcional -- en vez
// de replicar el hueco de seguridad original o inventar 10 acronimos
// distintos sin necesidad real de granularidad más fina.
router.get('/consolidado-bicu-cnu', requireAuth, requirePermission('REPIN'), controller.consolidadoBicuCnu);
router.get('/consolidado-por-centro', requireAuth, requirePermission('REPIN'), controller.consolidadoPorCentro);
router.get('/consolidado-por-area', requireAuth, requirePermission('REPIN'), controller.consolidadoPorAreaConocimiento);
router.get('/consolidado-unicam', requireAuth, requirePermission('REPIN'), controller.consolidadoUnicam);
router.get('/multiple-tipo-ingreso', requireAuth, requirePermission('REPIN'), controller.multiplePorTipoIngreso);
router.get('/multiple-tipo-ingreso/detalle', requireAuth, requirePermission('REPIN'), controller.multiplePorTipoIngresoDetalle);
router.get('/registro/:id', requireAuth, requirePermission('REPIN'), controller.registroIndividual);
router.get('/registro/:id/detalle', requireAuth, requirePermission('REPIN'), controller.registroIndividualDetalle);
router.get('/ultima-actualizacion', requireAuth, requirePermission('REPIN'), controller.ultimaActualizacionPorCentro);
router.get('/ultima-actualizacion/detalle', requireAuth, requirePermission('REPIN'), controller.ultimaActualizacionPorCentroDetalle);

export default router;
