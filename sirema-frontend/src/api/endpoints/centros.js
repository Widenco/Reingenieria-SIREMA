import { axiosClient } from '../axiosClient.js';

export const listarCentros = () =>
  axiosClient.get('/centros').then((r) => r.data);

export const obtenerCentro = (id) =>
  axiosClient.get(`/centros/${id}`).then((r) => r.data);

export const crearCentro = (datos) =>
  axiosClient.post('/centros', datos).then((r) => r.data);

export const actualizarCentro = (id, datos) =>
  axiosClient.put(`/centros/${id}`, datos).then((r) => r.data);

export const cambiarEstadoCentro = (id) =>
  axiosClient.patch(`/centros/${id}/estado`).then((r) => r.data);