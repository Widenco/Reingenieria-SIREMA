import { axiosClient } from '../axiosClient.js';

export const login = (nombreUsuario, clave) =>
  axiosClient.post('/auth/login', { nombreUsuario, clave }).then((r) => r.data);

export const obtenerSesion = () =>
  axiosClient.get('/auth/me').then((r) => r.data);

export const logout = () => axiosClient.post('/auth/logout');
