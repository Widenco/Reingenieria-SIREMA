import { axiosClient } from '../axiosClient.js';

export const listarTiposCentro = () =>
  axiosClient.get('/tipos-centro').then((r) => r.data);