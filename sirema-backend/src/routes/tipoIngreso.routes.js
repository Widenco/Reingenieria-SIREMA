import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/tipoIngreso.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('TININ'), controller.listar);
router.get('/:id', requireAuth, requirePermission('TININ'), controller.obtener);
router.post('/', requireAuth, requirePermission('TINCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('TINUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('TINCHS'), controller.cambiarEstado);

export default router;
