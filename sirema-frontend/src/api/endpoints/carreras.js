import { axiosClient } from '../axiosClient.js';

export const listarCarreras = () =>
  axiosClient.get('/carreras').then((r) => r.data);