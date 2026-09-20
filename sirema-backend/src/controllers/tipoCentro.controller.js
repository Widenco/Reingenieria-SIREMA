import * as tipoCentroService from '../services/tipoCentro.service.js';
import { crearTipoCentroSchema, actualizarTipoCentroSchema } from '../validators/tipoCentro.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await tipoCentroService.listarTiposCentro());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const tipoCentro = await tipoCentroService.buscarTipoCentro(Number(req.params.id));
    if (!tipoCentro) return res.status(404).json({ error: 'Tipo de centro no encontrado' });
    res.json(tipoCentro);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearTipoCentroSchema.parse(req.body);
    await tipoCentroService.crearTipoCentro(datos);
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
    const datos = actualizarTipoCentroSchema.parse(req.body);
    await tipoCentroService.actualizarTipoCentro(Number(req.params.id), datos);
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
    const tipoCentro = await tipoCentroService.buscarTipoCentro(Number(req.params.id));
    if (!tipoCentro) return res.status(404).json({ error: 'Tipo de centro no encontrado' });
    const nuevoEstado = tipoCentro.Estado ? 0 : 1;
    await tipoCentroService.cambiarEstadoTipoCentro(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
