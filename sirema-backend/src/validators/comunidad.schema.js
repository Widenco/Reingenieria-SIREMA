import { z } from 'zod';

export const crearComunidadSchema = z.object({
  descripcion: z.string().min(1).max(140),
  municipioId: z.number().int().positive(),
});

export const actualizarComunidadSchema = crearComunidadSchema;
