import { axiosClient } from '../axiosClient.js';

export const listarAniosCarrera = () =>
  axiosClient.get('/anios-carrera').then((r) => r.data);