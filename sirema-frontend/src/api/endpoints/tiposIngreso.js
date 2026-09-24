import { axiosClient } from '../axiosClient.js';

export const listarTiposIngreso = () =>
  axiosClient.get('/tipos-ingreso').then((r) => r.data);