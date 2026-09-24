import { axiosClient } from '../axiosClient.js';

export const listarAreasConocimiento = () =>
  axiosClient.get('/areas-conocimiento').then((r) => r.data);

export const obtenerAreaConocimiento = (id) =>
  axiosClient.get(`/areas-conocimiento/${id}`).then((r) => r.data);

export const crearAreaConocimiento = (datos) =>
  axiosClient.post('/areas-conocimiento', datos).then((r) => r.data);

export const actualizarAreaConocimiento = (id, datos) =>
  axiosClient.put(`/areas-conocimiento/${id}`, datos).then((r) => r.data);

export const cambiarEstadoAreaConocimiento = (id) =>
  axiosClient.patch(`/areas-conocimiento/${id}/estado`).then((r) => r.data);