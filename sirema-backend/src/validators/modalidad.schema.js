import { z } from 'zod';

export const crearSchema = z.object({
  descripcion: z.string().min(1).max(90),
  tipoModalidadId: z.number().int().positive(),
});

export const actualizarSchema = crearSchema;
