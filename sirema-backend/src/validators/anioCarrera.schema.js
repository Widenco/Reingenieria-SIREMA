import { z } from 'zod';

export const crearSchema = z.object({
  descripcion: z.string().min(1).max(4),
});

export const actualizarSchema = crearSchema;
