import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/anioCarrera.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('ANCIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('ANCIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('ANCCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('ANCUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('ANCCHS'), controller.cambiarEstado);

export default router;
