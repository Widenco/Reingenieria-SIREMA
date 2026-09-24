import { axiosClient } from '../axiosClient.js';

export const listarFunciones = () =>
  axiosClient.get('/funciones').then((r) => r.data);