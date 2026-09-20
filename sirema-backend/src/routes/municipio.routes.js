import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as municipioController from '../controllers/municipio.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('MUNIN'), municipioController.listar);
router.get('/:id', requireAuth, requirePermission('MUNIN'), municipioController.obtener);
router.post('/', requireAuth, requirePermission('MUNCR'), municipioController.crear);
router.put('/:id', requireAuth, requirePermission('MUNUP'), municipioController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('MUNCHS'), municipioController.cambiarEstado);

export default router;
