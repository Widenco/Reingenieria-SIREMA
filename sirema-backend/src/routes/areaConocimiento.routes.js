import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/areaConocimiento.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('ARCIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('ARCIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('ARCCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('ARCUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('ARCCHS'), controller.cambiarEstado);

export default router;
