import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/turno.controller.js';

const router = Router();

router.get('/', requireAuth, requirePermission('TURIN'), controller.listar);
router.get('/por-modalidad/:modalidadId', requireAuth, requirePermission('TURIN'), controller.listarPorModalidad);
router.get('/:id', requireAuth, requirePermission('TURIN'), controller.obtener);
router.post('/', requireAuth, requirePermission('TURCR'), controller.crear);
router.put('/:id', requireAuth, requirePermission('TURUP'), controller.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('TURCHS'), controller.cambiarEstado);

export default router;
