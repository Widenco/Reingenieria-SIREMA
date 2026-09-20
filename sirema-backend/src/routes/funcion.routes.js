import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as funcionController from '../controllers/funcion.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('FUNIN'), funcionController.listar);
router.get('/:id', requireAuth, requirePermission('FUNIN'), funcionController.obtener);
router.post('/', requireAuth, requirePermission('FUNCR'), funcionController.crear);
router.put('/:id', requireAuth, requirePermission('FUNUP'), funcionController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('FUNCHS'), funcionController.cambiarEstado);

export default router;
