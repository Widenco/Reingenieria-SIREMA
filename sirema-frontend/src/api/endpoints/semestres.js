import { axiosClient } from '../axiosClient.js';

export const listarSemestres = () =>
  axiosClient.get('/semestres').then((r) => r.data);