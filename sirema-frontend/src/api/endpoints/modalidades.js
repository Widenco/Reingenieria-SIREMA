import { axiosClient } from '../axiosClient.js';

export const listarModalidades = () =>
  axiosClient.get('/modalidades').then((r) => r.data);