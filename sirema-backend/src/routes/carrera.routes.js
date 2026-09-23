import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/carrera.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('CARIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('CARIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('CARCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('CARUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('CARCHS'), controller.cambiarEstado);

export default router;
