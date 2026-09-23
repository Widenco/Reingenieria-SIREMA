import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/grupo.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('GRPIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('GRPIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('GRPCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('GRPUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('GRPCHS'), controller.cambiarEstado);

export default router;
