import { axiosClient } from '../axiosClient.js';

export const listarMunicipios = () =>
  axiosClient.get('/municipios').then((r) => r.data);