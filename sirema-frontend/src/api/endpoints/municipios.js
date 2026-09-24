import { axiosClient } from '../axiosClient.js';

export const listarMunicipios = () =>
  axiosClient.get('/municipios').then((r) => r.data);

export const obtenerMunicipio = (id) =>
  axiosClient.get(`/municipios/${id}`).then((r) => r.data);

export const crearMunicipio = (datos) =>
  axiosClient.post('/municipios', datos).then((r) => r.data);

export const actualizarMunicipio = (id, datos) =>
  axiosClient.put(`/municipios/${id}`, datos).then((r) => r.data);

export const cambiarEstadoMunicipio = (id) =>
  axiosClient.patch(`/municipios/${id}/estado`).then((r) => r.data);