import { z } from 'zod';

export const crearSchema = z.object({
  anio: z.number().int().min(2000).max(2100),
});

export const actualizarSchema = crearSchema;
