import * as municipioService from '../services/municipio.service.js';
import { crearMunicipioSchema, actualizarMunicipioSchema } from '../validators/municipio.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await municipioService.listarMunicipios());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const municipio = await municipioService.buscarMunicipio(Number(req.params.id));
    if (!municipio) return res.status(404).json({ error: 'Municipio no encontrado' });
    res.json(municipio);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearMunicipioSchema.parse(req.body);
    await municipioService.crearMunicipio(datos);
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
    const datos = actualizarMunicipioSchema.parse(req.body);
    await municipioService.actualizarMunicipio(Number(req.params.id), datos);
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
    const municipio = await municipioService.buscarMunicipio(Number(req.params.id));
    if (!municipio) return res.status(404).json({ error: 'Municipio no encontrado' });
    const nuevoEstado = municipio.Estado ? 0 : 1;
    await municipioService.cambiarEstadoMunicipio(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
