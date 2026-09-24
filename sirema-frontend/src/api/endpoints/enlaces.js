import { axiosClient } from '../axiosClient.js';

export const listarEnlaces = () =>
  axiosClient.get('/enlaces').then((r) => r.data);

export const obtenerEnlace = (id) =>
  axiosClient.get(`/enlaces/${id}`).then((r) => r.data);

export const crearEnlace = (datos) =>
  axiosClient.post('/enlaces', datos).then((r) => r.data);

export const actualizarEnlace = (id, datos) =>
  axiosClient.put(`/enlaces/${id}`, datos).then((r) => r.data);

export const cambiarEstadoEnlace = (id) =>
  axiosClient.patch(`/enlaces/${id}/estado`).then((r) => r.data);