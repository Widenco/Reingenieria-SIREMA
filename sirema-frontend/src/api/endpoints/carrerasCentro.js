import { axiosClient } from '../axiosClient.js';

export const listarCarrerasPertenecientes = (centroId) =>
  axiosClient
    .get(`/carreras-centro/pertenecientes/${centroId}`)
    .then((r) => r.data);

export const listarCarrerasDisponibles = (centroId) =>
  axiosClient
    .get(`/carreras-centro/no-pertenecientes/${centroId}`)
    .then((r) => r.data);

export const habilitarCarreraCentro = (carreraId, centroId) =>
  axiosClient
    .post('/carreras-centro/habilitar', { carreraId, centroId })
    .then((r) => r.data);

export const deshabilitarCarreraCentro = (id) =>
  axiosClient
    .patch(`/carreras-centro/${id}/deshabilitar`)
    .then((r) => r.data);