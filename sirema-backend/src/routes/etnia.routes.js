import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as etniaController from '../controllers/etnia.controller.js';

const router = Router();

// El sistema original NO protege este módulo con ningún permiso
// (etniaController.php no tiene una sola llamada a validarPermiso).
// Se decidió agregar acronimos propios (ETNIN/ETNCR/ETNUP/ETNCHS) para
// que quede cubierto por el RBAC, en vez de replicar la laguna original.
router.get('/', requireAuth, requirePermission('ETNIN'), etniaController.listar);
router.get('/:id', requireAuth, requirePermission('ETNIN'), etniaController.obtener);
router.post('/', requireAuth, requirePermission('ETNCR'), etniaController.crear);
router.put('/:id', requireAuth, requirePermission('ETNUP'), etniaController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('ETNCHS'), etniaController.cambiarEstado);

export default router;
