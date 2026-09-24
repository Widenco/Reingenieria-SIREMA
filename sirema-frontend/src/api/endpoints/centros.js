import { axiosClient } from '../axiosClient.js';

export const listarCentros = () =>
  axiosClient.get('/centros').then((r) => r.data);