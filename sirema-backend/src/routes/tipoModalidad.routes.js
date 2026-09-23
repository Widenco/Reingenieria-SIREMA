import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/tipoModalidad.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('TMCNUIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('TMCNUIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('TMCNUCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('TMCNUUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('TMCNUCHS'), controller.cambiarEstado);

export default router;
