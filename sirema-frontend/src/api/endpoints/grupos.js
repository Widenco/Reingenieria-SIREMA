import { axiosClient } from '../axiosClient.js';

export const listarGrupos = () =>
  axiosClient.get('/grupos').then((r) => r.data);

export const obtenerGrupo = (id) =>
  axiosClient.get(`/grupos/${id}`).then((r) => r.data);

export const crearGrupo = (datos) =>
  axiosClient.post('/grupos', datos).then((r) => r.data);

export const actualizarGrupo = (id, datos) =>
  axiosClient.put(`/grupos/${id}`, datos).then((r) => r.data);

export const cambiarEstadoGrupo = (id) =>
  axiosClient.patch(`/grupos/${id}/estado`).then((r) => r.data);