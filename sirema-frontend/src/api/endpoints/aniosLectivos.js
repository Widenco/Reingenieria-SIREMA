import { axiosClient } from '../axiosClient.js';

export const listarAniosLectivos = () =>
  axiosClient.get('/anios-lectivo').then((r) => r.data);

export const obtenerAnioLectivo = (id) =>
  axiosClient.get(`/anios-lectivo/${id}`).then((r) => r.data);

export const crearAnioLectivo = (datos) =>
  axiosClient.post('/anios-lectivo', datos).then((r) => r.data);

export const actualizarAnioLectivo = (id, datos) =>
  axiosClient.put(`/anios-lectivo/${id}`, datos).then((r) => r.data);

export const cambiarEstadoAnioLectivo = (id) =>
  axiosClient.patch(`/anios-lectivo/${id}/estado`).then((r) => r.data);