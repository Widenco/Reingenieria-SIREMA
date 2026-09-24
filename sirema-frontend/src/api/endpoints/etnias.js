import { axiosClient } from '../axiosClient.js';

export const listarEtnias = () =>
  axiosClient.get('/etnias').then((r) => r.data);

export const obtenerEtnia = (id) =>
  axiosClient.get(`/etnias/${id}`).then((r) => r.data);

export const crearEtnia = (datos) =>
  axiosClient.post('/etnias', datos).then((r) => r.data);

export const actualizarEtnia = (id, datos) =>
  axiosClient.put(`/etnias/${id}`, datos).then((r) => r.data);

export const cambiarEstadoEtnia = (id) =>
  axiosClient.patch(`/etnias/${id}/estado`).then((r) => r.data);