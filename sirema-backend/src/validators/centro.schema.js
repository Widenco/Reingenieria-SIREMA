import { z } from 'zod';

// padreId: 0 significa "es un centro raíz / sede", no un valor faltante
// -- así lo trata centro_get_padres() (WHERE Padre_Id < 1).
export const crearCentroSchema = z.object({
  descripcion: z.string().min(1).max(240),
  tipoCentroId: z.number().int().positive(),
  comunidadId: z.number().int().positive(),
  padreId: z.number().int().nonnegative().default(0),
});

export const actualizarCentroSchema = crearCentroSchema;
