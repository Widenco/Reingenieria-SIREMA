import { axiosClient } from '../axiosClient.js';

export const listarGrupos = () =>
  axiosClient.get('/grupos').then((r) => r.data);