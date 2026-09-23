import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/anioLectivo.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('ANLIN'), controller.listar);
router.get('/:id', requireAuth, requirePermission('ANLIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('ANLCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('ANLUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('ANLCHS'), controller.cambiarEstado);

export default router;
