import { axiosClient } from '../axiosClient.js';

export const listarEtnias = () =>
  axiosClient.get('/etnias').then((r) => r.data);