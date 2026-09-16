import { z } from 'zod';

// municipio.DescripcionMunicipio es varchar(150), pero el procedimiento
// municipio_crear recibe varchar(140) -- usamos el límite más estricto
// de los dos para no dejar pasar algo que el procedimiento trunque.
export const crearMunicipioSchema = z.object({
  descripcion: z.string().min(1).max(140),
});

export const actualizarMunicipioSchema = crearMunicipioSchema;
