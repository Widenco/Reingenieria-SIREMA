import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as controller from '../controllers/matricula.controller.js';

const router = Router();

// Acronimos reales del sistema original (views/modules/registro/matriculados/*.php
// y matriculadoController.php). No existe un acronimo propio para "ver
// centros/carreras permitidas" -- se protegen igual con MATRIN porque son
// parte del mismo flujo de consulta, no una acción nueva.
router.get('/', requireAuth, requirePermission('MATRIN'), controller.listar);
router.get('/centros/:tipo', requireAuth, requirePermission('MATRIN'), controller.centrosPermitidos);
router.get('/carreras/:centroId', requireAuth, requirePermission('MATRIN'), controller.carrerasPermitidas);
router.post('/', requireAuth, requirePermission('MATRCR'), controller.crear);
router.patch('/:id/anular', requireAuth, requirePermission('MATRCHS'), controller.anular);

export default router;
