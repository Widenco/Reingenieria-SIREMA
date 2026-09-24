import { axiosClient } from '../axiosClient.js';

export const listarEnlaces = () =>
  axiosClient.get('/enlaces').then((r) => r.data);