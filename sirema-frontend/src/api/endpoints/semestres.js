import { axiosClient } from '../axiosClient.js';

export const listarSemestres = () =>
  axiosClient.get('/semestres').then((r) => r.data);

export const obtenerSemestre = (id) =>
  axiosClient.get(`/semestres/${id}`).then((r) => r.data);

export const crearSemestre = (datos) =>
  axiosClient.post('/semestres', datos).then((r) => r.data);

export const actualizarSemestre = (id, datos) =>
  axiosClient.put(`/semestres/${id}`, datos).then((r) => r.data);

export const cambiarEstadoSemestre = (id) =>
  axiosClient.patch(`/semestres/${id}/estado`).then((r) => r.data);