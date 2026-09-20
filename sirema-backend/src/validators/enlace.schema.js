import { z } from 'zod';

// Mismos límites de longitud que las columnas reales de la tabla `menu`
// (varchar(50), varchar(40), varchar(30)), para fallar antes de llegar
// a la base de datos con un error de MySQL menos claro.
export const crearEnlaceSchema = z.object({
  textoMostrar: z.string().min(1).max(50),
  modulo: z.string().min(1).max(50),
  iconoModulo: z.string().max(40).optional().default(''),
  accion: z.string().min(1).max(30),
  iconoAccion: z.string().max(40).optional().default(''),
  estado: z.boolean().default(true),
  padreId: z.number().int().nonnegative().default(0), // 0 = sin padre (enlace raíz)
});

export const actualizarEnlaceSchema = crearEnlaceSchema.omit({ estado: true });
