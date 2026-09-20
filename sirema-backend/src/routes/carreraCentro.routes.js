import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as carreraCentroController from '../controllers/carreraCentro.controller.js';

const router = Router();

// El sistema original solo define 2 acronimos para este módulo:
// CACEIN para listar/consultar, CACECR para la acción de habilitar.
// No hay un acronimo separado para deshabilitar en el código original
// (otra inconsistencia de enforcement que ya documentamos) -- aquí se
// decidió proteger también deshabilitar con CACECR, más estricto que
// el original, no menos.
router.get(
  '/no-pertenecientes/:centroId',
  requireAuth,
  requirePermission('CACEIN'),
  carreraCentroController.listarNoPertenecientes
);
router.get(
  '/pertenecientes/:centroId',
  requireAuth,
  requirePermission('CACEIN'),
  carreraCentroController.listarPertenecientes
);
router.post('/habilitar', requireAuth, requirePermission('CACECR'), carreraCentroController.habilitar);
router.patch(
  '/:id/deshabilitar',
  requireAuth,
  requirePermission('CACECR'),
  carreraCentroController.deshabilitar
);

export default router;
