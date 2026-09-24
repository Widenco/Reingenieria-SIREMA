import { z } from 'zod';

const detalleSchema = z.object({
  anioCarreraId: z.number().int().positive(),
  modalidadId: z.number().int().positive(),
  grupoId: z.number().int().positive(),
  turnoId: z.number().int().positive(),
  femenino: z.number().int().nonnegative(),
  masculino: z.number().int().nonnegative(),
});

export const crearMatriculaSchema = z.object({
  centroId: z.number().int().positive(),
  carreraId: z.number().int().positive(),
  tipoIngresoId: z.number().int().positive(),
  semestreId: z.number().int().positive(),
  anioLectivoId: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  detalle: z.array(detalleSchema).min(1, 'Debe incluir al menos una fila de detalle'),
});

// filtros del listado -- todos opcionales, 0/undefined significa "sin filtrar"
export const filtrosMatriculaSchema = z.object({
  centroId: z.coerce.number().int().optional().default(0),
  carreraId: z.coerce.number().int().optional().default(0),
  anioLectivoId: z.coerce.number().int().optional().default(0),
  tipoIngresoId: z.coerce.number().int().optional().default(0),
});
