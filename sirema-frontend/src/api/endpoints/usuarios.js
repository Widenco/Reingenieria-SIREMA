import { axiosClient } from '../axiosClient.js';

export const listarUsuarios = () =>
  axiosClient.get('/usuarios').then((r) => r.data);