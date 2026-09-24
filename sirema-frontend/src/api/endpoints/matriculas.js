import { axiosClient } from '../axiosClient.js';

export const listarMatriculas = (filtros = {}) =>
  axiosClient.get('/matricula', { params: filtros }).then((r) => r.data);

export const listarCentrosPermitidos = (tipo = 1) =>
  axiosClient.get(`/matricula/centros/${tipo}`).then((r) => r.data);

export const listarCarrerasPermitidas = (centroId) =>
  axiosClient.get(`/matricula/carreras/${centroId}`).then((r) => r.data);

export const crearMatricula = (datos) =>
  axiosClient.post('/matricula', datos).then((r) => r.data);

export const anularMatricula = (id) =>
  axiosClient.patch(`/matricula/${id}/anular`).then((r) => r.data);