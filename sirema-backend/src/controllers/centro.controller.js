import * as centroService from '../services/centro.service.js';
import { crearCentroSchema, actualizarCentroSchema } from '../validators/centro.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await centroService.listarCentros());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const centro = await centroService.buscarCentro(Number(req.params.id));
    if (!centro) return res.status(404).json({ error: 'Centro no encontrado' });
    res.json(centro);
  } catch (err) {
    next(err);
  }
}

export async function listarPadres(req, res, next) {
  try {
    res.json(await centroService.listarCentrosPadres());
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearCentroSchema.parse(req.body);
    await centroService.crearCentro(datos);
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
    const datos = actualizarCentroSchema.parse(req.body);
    await centroService.actualizarCentro(Number(req.params.id), datos);
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
    const centro = await centroService.buscarCentro(Number(req.params.id));
    if (!centro) return res.status(404).json({ error: 'Centro no encontrado' });
    const nuevoEstado = centro.Estado ? 0 : 1;
    await centroService.cambiarEstadoCentro(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
