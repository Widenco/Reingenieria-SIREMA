import { z } from "zod";

// Basado en la tabla `usuarios`: NombreUsuario varchar(150) UNIQUE,
// y en el procedimiento usuario_crear(Nombre, CentroId, Contra).
// OJO: usuario_crear NO recibe Rol_Id -> en tu service, después del INSERT
// necesitas un UPDATE usuarios SET Rol_Id = ? WHERE Id = ? por separado.

export const crearUsuarioSchema = z.object({
  nombreUsuario: z
    .string()
    .email("Debe ser un correo institucional válido")
    .max(150),
  clave: z.string().min(8, "Mínimo 8 caracteres"),
  centroId: z.number().int().positive(),
  rolId: z.number().int().positive(),
});

// Al actualizar, la clave es opcional: solo se reescribe si el admin
// decide resetearla, no en cada edición del usuario.
export const actualizarUsuarioSchema = z.object({
  nombreUsuario: z.string().email().max(150),
  centroId: z.number().int().positive(),
  rolId: z.number().int().positive(),
  clave: z.string().min(8).optional(),
});
