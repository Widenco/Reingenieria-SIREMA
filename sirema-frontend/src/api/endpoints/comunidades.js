import { axiosClient } from '../axiosClient.js';

export const listarComunidades = () =>
  axiosClient.get('/comunidades').then((r) => r.data);