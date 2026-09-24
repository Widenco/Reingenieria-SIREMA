import { axiosClient } from '../axiosClient.js';

export const listarTurnos = () =>
  axiosClient.get('/turnos').then((r) => r.data);

export const obtenerTurno = (id) =>
  axiosClient.get(`/turnos/${id}`).then((r) => r.data);

export const crearTurno = (datos) =>
  axiosClient.post('/turnos', datos).then((r) => r.data);

export const actualizarTurno = (id, datos) =>
  axiosClient.put(`/turnos/${id}`, datos).then((r) => r.data);

export const cambiarEstadoTurno = (id) =>
  axiosClient.patch(`/turnos/${id}/estado`).then((r) => r.data);