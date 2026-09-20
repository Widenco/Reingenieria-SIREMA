import * as carreraCentroService from '../services/carreraCentro.service.js';
import { asignarCarreraCentroSchema } from '../validators/carreraCentro.schema.js';

export async function listarNoPertenecientes(req, res, next) {
  try {
    const carreras = await carreraCentroService.carrerasNoPertenecientes(
      Number(req.params.centroId)
    );
    res.json(carreras);
  } catch (err) {
    next(err);
  }
}

export async function listarPertenecientes(req, res, next) {
  try {
    const carreras = await carreraCentroService.carrerasPertenecientes(
      Number(req.params.centroId)
    );
    res.json(carreras);
  } catch (err) {
    next(err);
  }
}

export async function habilitar(req, res, next) {
  try {
    const { carreraId, centroId } = asignarCarreraCentroSchema.parse(req.body);
    await carreraCentroService.habilitarCarreraCentro(carreraId, centroId);
    res.json({ ok: true });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: err.issues });
    }
    next(err);
  }
}

export async function deshabilitar(req, res, next) {
  try {
    await carreraCentroService.deshabilitarCarreraCentro(Number(req.params.id));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
