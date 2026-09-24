import { axiosClient } from '../axiosClient.js';

export const listarCarreras = () =>
  axiosClient.get('/carreras').then((r) => r.data);

export const obtenerCarrera = (id) =>
  axiosClient.get(`/carreras/${id}`).then((r) => r.data);

export const crearCarrera = (datos) =>
  axiosClient.post('/carreras', datos).then((r) => r.data);

export const actualizarCarrera = (id, datos) =>
  axiosClient.put(`/carreras/${id}`, datos).then((r) => r.data);

export const cambiarEstadoCarrera = (id) =>
  axiosClient.patch(`/carreras/${id}/estado`).then((r) => r.data);