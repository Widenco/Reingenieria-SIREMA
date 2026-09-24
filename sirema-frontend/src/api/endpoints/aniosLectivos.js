import { axiosClient } from '../axiosClient.js';

export const listarAniosLectivos = () =>
  axiosClient.get('/anios-lectivo').then((r) => r.data);