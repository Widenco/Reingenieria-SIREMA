import { z } from 'zod';

// etnia.DescripcionEtnia es varchar(45), pero etnia_crear recibe varchar(40)
// -- se usa el límite más estricto (40).
export const crearEtniaSchema = z.object({
  descripcion: z.string().min(1).max(40),
});

export const actualizarEtniaSchema = crearEtniaSchema;
