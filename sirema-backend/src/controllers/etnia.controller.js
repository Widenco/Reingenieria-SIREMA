import * as etniaService from '../services/etnia.service.js';
import { crearEtniaSchema, actualizarEtniaSchema } from '../validators/etnia.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await etniaService.listarEtnias());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const etnia = await etniaService.buscarEtnia(Number(req.params.id));
    if (!etnia) return res.status(404).json({ error: 'Etnia no encontrada' });
    res.json(etnia);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearEtniaSchema.parse(req.body);
    await etniaService.crearEtnia(datos);
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
    const datos = actualizarEtniaSchema.parse(req.body);
    await etniaService.actualizarEtnia(Number(req.params.id), datos);
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
    const etnia = await etniaService.buscarEtnia(Number(req.params.id));
    if (!etnia) return res.status(404).json({ error: 'Etnia no encontrada' });
    const nuevoEstado = etnia.Estado ? 0 : 1;
    await etniaService.cambiarEstadoEtnia(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
