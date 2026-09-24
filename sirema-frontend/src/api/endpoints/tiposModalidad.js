import { axiosClient } from '../axiosClient.js';

export const listarTiposModalidad = () =>
  axiosClient.get('/tipos-modalidad').then((r) => r.data);

export const obtenerTipoModalidad = (id) =>
  axiosClient.get(`/tipos-modalidad/${id}`).then((r) => r.data);

export const crearTipoModalidad = (datos) =>
  axiosClient.post('/tipos-modalidad', datos).then((r) => r.data);

export const actualizarTipoModalidad = (id, datos) =>
  axiosClient.put(`/tipos-modalidad/${id}`, datos).then((r) => r.data);

export const cambiarEstadoTipoModalidad = (id) =>
  axiosClient.patch(`/tipos-modalidad/${id}/estado`).then((r) => r.data);