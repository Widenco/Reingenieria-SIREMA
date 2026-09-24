import { axiosClient } from '../axiosClient.js';

export const listarUsuarios = () =>
  axiosClient.get('/usuarios').then((r) => r.data);

export const obtenerUsuario = (id) =>
  axiosClient.get(`/usuarios/${id}`).then((r) => r.data);

export const crearUsuario = (datos) =>
  axiosClient.post('/usuarios', datos).then((r) => r.data);

export const actualizarUsuario = (id, datos) =>
  axiosClient.put(`/usuarios/${id}`, datos).then((r) => r.data);

export const cambiarEstadoUsuario = (id) =>
  axiosClient.patch(`/usuarios/${id}/estado`).then((r) => r.data);