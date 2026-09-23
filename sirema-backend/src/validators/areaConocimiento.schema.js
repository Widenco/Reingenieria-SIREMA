import { z } from 'zod';

export const crearSchema = z.object({
  descripcion: z.string().min(1).max(240),
  acronimo: z.string().min(1).max(25),
});

export const actualizarSchema = crearSchema;
