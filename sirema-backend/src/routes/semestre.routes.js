import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/semestre.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('SEMIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('SEMIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('SEMCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('SEMUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('SEMCHS'), controller.cambiarEstado);

export default router;
