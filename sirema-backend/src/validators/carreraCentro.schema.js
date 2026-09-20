import { z } from 'zod';

// carrera_centro es una tabla puente (Centro_Id, Carrera_Id, Estado).
// El sistema original la maneja con procedimientos que reciben SIEMPRE
// el par carreraId + centroId (filtro_habilitar_carrera_centro,
// filtro_actualizar_carrera_centro) — no un Id propio de la relación,
// excepto filtro_deshabilitarCarreraCentro que sí toma el Id de la fila
// (ese lo recibes por parámetro de ruta, no necesita schema de body).

export const asignarCarreraCentroSchema = z.object({
  carreraId: z.number().int().positive(),
  centroId: z.number().int().positive(),
});
