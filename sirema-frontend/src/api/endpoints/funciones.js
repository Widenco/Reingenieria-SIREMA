import { axiosClient } from '../axiosClient.js';

export const listarFunciones = () =>
  axiosClient.get('/funciones').then((r) => r.data);

export const obtenerFuncion = (id) =>
  axiosClient.get(`/funciones/${id}`).then((r) => r.data);

export const crearFuncion = (datos) =>
  axiosClient.post('/funciones', datos).then((r) => r.data);

export const actualizarFuncion = (id, datos) =>
  axiosClient.put(`/funciones/${id}`, datos).then((r) => r.data);

export const cambiarEstadoFuncion = (id) =>
  axiosClient.patch(`/funciones/${id}/estado`).then((r) => r.data);