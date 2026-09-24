import { axiosClient } from '../axiosClient.js';

export const listarCarrerasPertenecientes = (centroId) =>
  axiosClient
    .get(`/carreras-centro/pertenecientes/${centroId}`)
    .then((r) => r.data);

export const listarCarrerasDisponibles = (centroId) =>
  axiosClient
    .get(`/carreras-centro/no-pertenecentes/${centroId}`)
    .then((r) => r.data);