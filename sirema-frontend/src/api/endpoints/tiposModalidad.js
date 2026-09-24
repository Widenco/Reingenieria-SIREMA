import { axiosClient } from '../axiosClient.js';

export const listarTiposModalidad = () =>
  axiosClient.get('/tipos-modalidad').then((r) => r.data);