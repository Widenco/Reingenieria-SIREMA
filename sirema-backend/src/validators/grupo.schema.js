import { z } from 'zod';

// grupos.DescripcionGrupo es varchar(3) -- son literales de una letra (A, B, C...)
export const crearSchema = z.object({
  descripcion: z.string().min(1).max(3),
});

export const actualizarSchema = crearSchema;
