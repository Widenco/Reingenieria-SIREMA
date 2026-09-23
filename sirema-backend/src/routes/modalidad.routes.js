import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/modalidad.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('MODIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('MODIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('MODCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('MODUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('MODCHS'), controller.cambiarEstado);

export default router;
