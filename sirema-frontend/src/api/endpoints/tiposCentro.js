import { axiosClient } from '../axiosClient.js';

export const listarTiposCentro = () =>
  axiosClient.get('/tipos-centro').then((r) => r.data);

export const obtenerTipoCentro = (id) =>
  axiosClient.get(`/tipos-centro/${id}`).then((r) => r.data);

export const crearTipoCentro = (datos) =>
  axiosClient.post('/tipos-centro', datos).then((r) => r.data);

export const actualizarTipoCentro = (id, datos) =>
  axiosClient.put(`/tipos-centro/${id}`, datos).then((r) => r.data);

export const cambiarEstadoTipoCentro = (id) =>
  axiosClient.patch(`/tipos-centro/${id}/estado`).then((r) => r.data);