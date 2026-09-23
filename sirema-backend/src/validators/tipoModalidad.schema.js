import { z } from 'zod';

export const crearSchema = z.object({
  descripcion: z.string().min(1).max(50),
});

export const actualizarSchema = crearSchema;
