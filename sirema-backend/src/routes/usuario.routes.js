import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as usuarioController from '../controllers/usuario.controller.js';

const router = Router();

// Acronimos reales del sistema original (ver views/modules/admin/users/*.php
// y controllers/userController.php).
router.get('/', requireAuth, requirePermission('USIN'), usuarioController.listar);
router.get('/:id', requireAuth, requirePermission('USIN'), usuarioController.obtener);
router.post('/', requireAuth, requirePermission('USCR'), usuarioController.crear);
router.put('/:id', requireAuth, requirePermission('USUP'), usuarioController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('USCHS'), usuarioController.cambiarEstado);

export default router;
