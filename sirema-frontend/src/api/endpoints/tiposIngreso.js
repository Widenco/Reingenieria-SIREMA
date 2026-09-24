import { axiosClient } from '../axiosClient.js';

export const listarTiposIngreso = () =>
  axiosClient.get('/tipos-ingreso').then((r) => r.data);

export const obtenerTipoIngreso = (id) =>
  axiosClient.get(`/tipos-ingreso/${id}`).then((r) => r.data);

export const crearTipoIngreso = (datos) =>
  axiosClient.post('/tipos-ingreso', datos).then((r) => r.data);

export const actualizarTipoIngreso = (id, datos) =>
  axiosClient.put(`/tipos-ingreso/${id}`, datos).then((r) => r.data);

export const cambiarEstadoTipoIngreso = (id) =>
  axiosClient.patch(`/tipos-ingreso/${id}/estado`).then((r) => r.data);