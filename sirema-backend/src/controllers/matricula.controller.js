import * as service from '../services/matricula.service.js';
import { crearMatriculaSchema, filtrosMatriculaSchema } from '../validators/matricula.schema.js';

export async function listar(req, res, next) {
  try {
    const filtros = filtrosMatriculaSchema.parse(req.query);
    const registros = await service.listar(req.session.usuario.nombreUsuario, filtros);
    res.json(registros);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Filtros inválidos', detalles: err.issues });
    }
    next(err);
  }
}

export async function centrosPermitidos(req, res, next) {
  try {
    const tipo = Number(req.params.tipo);
    const centros = await service.centrosPermitidos(req.session.usuario.nombreUsuario, tipo);
    res.json(centros);
  } catch (err) {
    next(err);
  }
}

export async function carrerasPermitidas(req, res, next) {
  try {
    const centroId = Number(req.params.centroId);
    const carreras = await service.carrerasPermitidas(
      centroId,
      req.session.usuario.nombreUsuario
    );
    res.json(carreras);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearMatriculaSchema.parse(req.body);
    const id = await service.crear(req.session.usuario.nombreUsuario, datos);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: err.issues });
    }
    next(err);
  }
}

export async function anular(req, res, next) {
  try {
    await service.anular(Number(req.params.id));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
