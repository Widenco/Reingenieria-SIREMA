import { axiosClient } from '../axiosClient.js';

export const listarModalidades = () =>
  axiosClient.get('/modalidades').then((r) => r.data);

export const obtenerModalidad = (id) =>
  axiosClient.get(`/modalidades/${id}`).then((r) => r.data);

export const crearModalidad = (datos) =>
  axiosClient.post('/modalidades', datos).then((r) => r.data);

export const actualizarModalidad = (id, datos) =>
  axiosClient.put(`/modalidades/${id}`, datos).then((r) => r.data);

export const cambiarEstadoModalidad = (id) =>
  axiosClient.patch(`/modalidades/${id}/estado`).then((r) => r.data);