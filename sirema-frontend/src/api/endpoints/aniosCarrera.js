import { axiosClient } from '../axiosClient.js';

export const listarAniosCarrera = () =>
  axiosClient.get('/anios-carrera').then((r) => r.data);

export const obtenerAnioCarrera = (id) =>
  axiosClient.get(`/anios-carrera/${id}`).then((r) => r.data);

export const crearAnioCarrera = (datos) =>
  axiosClient.post('/anios-carrera', datos).then((r) => r.data);

export const actualizarAnioCarrera = (id, datos) =>
  axiosClient.put(`/anios-carrera/${id}`, datos).then((r) => r.data);

export const cambiarEstadoAnioCarrera = (id) =>
  axiosClient.patch(`/anios-carrera/${id}/estado`).then((r) => r.data);