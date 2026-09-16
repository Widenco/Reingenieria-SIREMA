import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requirePermission } from '../middlewares/requirePermission.js';
import * as comunidadController from '../controllers/comunidad.controller.js';

const router = Router();

// NOTA: el sistema original protege comunidades/index.php con 'MUNIN'
// (el acronimo de MUNICIPIOS, no uno propio de comunidad) -- parece un
// copy-paste sin corregir en el código PHP original. Aquí se decidió
// corregirlo con un acronimo propio 'COMIN'. Si prefieren replicar el
// bug tal cual para "portar fielmente" el sistema, cambien 'COMIN' por
// 'MUNIN' -- pero tendrían que crear esa fila en `funciones` de cualquier
// forma, así que no ahorra trabajo real, solo decide el nombre.
router.get('/', requireAuth, requirePermission('COMIN'), comunidadController.listar);
router.get('/:id', requireAuth, requirePermission('COMIN'), comunidadController.obtener);
router.post('/', requireAuth, requirePermission('COMCR'), comunidadController.crear);
router.put('/:id', requireAuth, requirePermission('COMUP'), comunidadController.actualizar);
router.patch('/:id/estado', requireAuth, requirePermission('COMCHS'), comunidadController.cambiarEstado);

export default router;
