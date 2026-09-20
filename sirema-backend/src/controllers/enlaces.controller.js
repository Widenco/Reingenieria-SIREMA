import * as enlacesService from '../services/enlaces.service.js';
import { crearEnlaceSchema, actualizarEnlaceSchema } from '../validators/enlace.schema.js';

export async function listar(req, res, next) {
  try {
    const enlaces = await enlacesService.listarEnlaces();
    res.json(enlaces);
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const enlace = await enlacesService.buscarEnlace(Number(req.params.id));
    if (!enlace) {
      return res.status(404).json({ error: 'Enlace no encontrado' });
    }
    res.json(enlace);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearEnlaceSchema.parse(req.body);
    await enlacesService.crearEnlace(datos);
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
    const datos = actualizarEnlaceSchema.parse(req.body);
    await enlacesService.actualizarEnlace(Number(req.params.id), datos);
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
    // Igual que hacía menuModel::change_state en PHP: primero se busca el
    // registro para invertir su estado actual, en vez de que el cliente
    // mande directamente el nuevo valor.
    const enlace = await enlacesService.buscarEnlace(Number(req.params.id));
    if (!enlace) {
      return res.status(404).json({ error: 'Enlace no encontrado' });
    }
    const nuevoEstado = enlace.Estado ? 0 : 1;
    await enlacesService.cambiarEstadoEnlace(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
