import { axiosClient } from '../axiosClient.js';

export const obtenerResumenAdministracion = () =>
  axiosClient.get('/administracion/resumen').then((response) => response.data);
