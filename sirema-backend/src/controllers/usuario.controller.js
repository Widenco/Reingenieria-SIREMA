import * as usuarioService from '../services/usuario.service.js';
import { crearUsuarioSchema, actualizarUsuarioSchema } from '../validators/usuario.schema.js';

export async function listar(req, res, next) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    // Nunca devolver el hash de la clave al frontend, aunque el SELECT
    // original (usuario_index) lo incluya.
    const sinClave = usuarios.map(({ Clave, ...resto }) => resto);
    res.json(sinClave);
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const usuario = await usuarioService.buscarUsuario(Number(req.params.id));
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { Clave, ...sinClave } = usuario;
    res.json(sinClave);
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const datos = crearUsuarioSchema.parse(req.body);
    const id = await usuarioService.crearUsuario(datos);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: err.issues });
    }
    // NombreUsuario es UNIQUE en la BD; un correo repetido cae aquí.
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    }
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    const datos = actualizarUsuarioSchema.parse(req.body);
    await usuarioService.actualizarUsuario(Number(req.params.id), datos);
    res.json({ ok: true });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: err.issues });
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    }
    next(err);
  }
}

export async function cambiarEstado(req, res, next) {
  try {
    const usuario = await usuarioService.buscarUsuario(Number(req.params.id));
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const nuevoEstado = usuario.Estado ? 0 : 1;
    await usuarioService.cambiarEstadoUsuario(Number(req.params.id), nuevoEstado);
    res.json({ ok: true, estado: nuevoEstado });
  } catch (err) {
    next(err);
  }
}
