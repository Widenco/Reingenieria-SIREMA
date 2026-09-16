import { z } from 'zod';

export const crearTipoCentroSchema = z.object({
  descripcion: z.string().min(1).max(250),
});

export const actualizarTipoCentroSchema = crearTipoCentroSchema;
