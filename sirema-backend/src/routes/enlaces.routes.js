import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as enlacesController from '../controllers/enlaces.controller.js';

const router = Router();

// Los acronimos (ENLIN, ENLCR, ENLUP, ENLCHS) son EXACTAMENTE los mismos que
// usaba el sistema original en cada vista PHP de este módulo (ver
// views/modules/admin/urls/*.php). Se reutilizan tal cual para no romper
// la asignación de permisos que el equipo ya haya definido para los roles.
router.get('/', requireAuth, requirePermission('ENLIN'), enlacesController.listar);
router.get('/:id', requireAuth, requirePermission('ENLIN'), enlacesController.obtener);
router.post('/', requireAuth, requirePermission('ENLCR'), enlacesController.crear);
router.put('/:id', requireAuth, requirePermission('ENLUP'), enlacesController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('ENLCHS'), enlacesController.cambiarEstado);

export default router;
