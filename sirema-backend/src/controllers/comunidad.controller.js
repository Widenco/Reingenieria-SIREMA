import * as comunidadService from '../services/comunidad.service.js';
import { crearComunidadSchema, actualizarComunidadSchema } from '../validators/comunidad.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await comunidadService.listarComunidades());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const comunidad = await comunidadService.buscarComunidad(Number(req.params.id));
    if (!comunidad) return res.status(404).json({ error: 'Comunidad no encontrada' });
    res.json(comunidad);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearComunidadSchema.parse(req.body);
    await comunidadService.crearComunidad(datos);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: err.issues });
    }
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    const datos = actualizarComunidadSchema.parse(req.body);
    await comunidadService.actualizarComunidad(Number(req.params.id), datos);
    res.json({ ok: true });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: err.issues });
    }
    next(err);
  }
}

export async function cambiarEstado(req, res, next) {
  try {
    const comunidad = await comunidadService.buscarComunidad(Number(req.params.id));
    if (!comunidad) return res.status(404).json({ error: 'Comunidad no encontrada' });
    const nuevoEstado = comunidad.Estado ? 0 : 1;
    await comunidadService.cambiarEstadoComunidad(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
