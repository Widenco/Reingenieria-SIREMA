import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as tipoCentroController from '../controllers/tipoCentro.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('TPCIN'), tipoCentroController.listar);
router.get('/:id', requireAuth, requirePermission('TPCIN'), tipoCentroController.obtener);
router.post('/', requireAuth, requirePermission('TPCCR'), tipoCentroController.crear);
router.put('/:id', requireAuth, requirePermission('TPCUP'), tipoCentroController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('TPCCHS'), tipoCentroController.cambiarEstado);

export default router;
