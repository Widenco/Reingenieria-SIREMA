import * as service from '../services/carrera.service.js';
import { crearSchema, actualizarSchema } from '../validators/carrera.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await service.listar());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const item = await service.buscar(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Carrera no encontrada' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearSchema.parse(req.body);
    await service.crear(datos);
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
    const datos = actualizarSchema.parse(req.body);
    await service.actualizar(Number(req.params.id), datos);
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
    const item = await service.buscar(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Carrera no encontrada' });
    const nuevoEstado = item.Estado ? 0 : 1;
    await service.cambiarEstado(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
