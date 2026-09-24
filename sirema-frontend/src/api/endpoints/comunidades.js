import { axiosClient } from '../axiosClient.js';

export const listarComunidades = () =>
  axiosClient.get('/comunidades').then((r) => r.data);

export const obtenerComunidad = (id) =>
  axiosClient.get(`/comunidades/${id}`).then((r) => r.data);

export const crearComunidad = (datos) =>
  axiosClient.post('/comunidades', datos).then((r) => r.data);

export const actualizarComunidad = (id, datos) =>
  axiosClient.put(`/comunidades/${id}`, datos).then((r) => r.data);

export const cambiarEstadoComunidad = (id) =>
  axiosClient.patch(`/comunidades/${id}/estado`).then((r) => r.data);