import { axiosClient } from '../axiosClient.js';

export const listarTurnos = () =>
  axiosClient.get('/turnos').then((r) => r.data);