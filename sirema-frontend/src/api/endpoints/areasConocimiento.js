import { axiosClient } from '../axiosClient.js';

export const listarAreasConocimiento = () =>
  axiosClient.get('/areas-conocimiento').then((r) => r.data);