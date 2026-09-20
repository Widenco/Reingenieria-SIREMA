import * as funcionService from '../services/funcion.service.js';
import { crearFuncionSchema, actualizarFuncionSchema } from '../validators/funcion.schema.js';

export async function listar(req, res, next) {
  try {
    res.json(await funcionService.listarFunciones());
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const funcion = await funcionService.buscarFuncion(Number(req.params.id));
    if (!funcion) {
      return res.status(404).json({ error: 'Función no encontrada' });
    }
    res.json(funcion);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearFuncionSchema.parse(req.body);
    await funcionService.crearFuncion(datos);
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
    const datos = actualizarFuncionSchema.parse(req.body);
    await funcionService.actualizarFuncion(Number(req.params.id), datos);
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
    const funcion = await funcionService.buscarFuncion(Number(req.params.id));
    if (!funcion) {
      return res.status(404).json({ error: 'Función no encontrada' });
    }
    const nuevoEstado = funcion.Estado ? 0 : 1;
    await funcionService.cambiarEstadoFuncion(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
