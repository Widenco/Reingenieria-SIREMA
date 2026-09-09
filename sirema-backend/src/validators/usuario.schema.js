import { z } from 'zod';

// Mismo esquema se reutiliza en el frontend con @hookform/resolvers/zod
// para no duplicar reglas de validación en dos lenguajes.
export const crearUsuarioSchema = z.object({
  nombreUsuario: z.string().email('Debe ser un correo institucional válido'),
  clave: z.string().min(8, 'Mínimo 8 caracteres'),
  rolId: z.number().int().positive(),
  centrosIds: z.array(z.number().int().positive()).min(1, 'Debe tener al menos un centro'),
});
