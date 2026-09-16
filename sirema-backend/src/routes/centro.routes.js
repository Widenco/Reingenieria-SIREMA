import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as centroController from '../controllers/centro.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('CENIN'), centroController.listar);
router.get('/padres', requireAuth, requirePermission('CENIN'), centroController.listarPadres);
router.get('/:id', requireAuth, requirePermission('CENIN'), centroController.obtener);
router.post('/', requireAuth, requirePermission('CENCR'), centroController.crear);
router.put('/:id', requireAuth, requirePermission('CENUP'), centroController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('CENCHS'), centroController.cambiarEstado);

export default router;
