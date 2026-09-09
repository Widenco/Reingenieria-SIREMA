import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // envía la cookie httpOnly del JWT
});

// IMPORTANTE: aquí NO se hace window.location.href para redirigir en un 401.
// Un 401 en /auth/me es una respuesta válida y esperada cuando todavía no hay
// sesión (por ejemplo, al cargar /login) — no es un error del que la app deba
// "escapar" recargando la página. Si redirigimos con window.location.href,
// forzamos un refresh completo del navegador, lo que vuelve a montar
// SessionProvider, que vuelve a llamar /auth/me, que vuelve a dar 401,
// que vuelve a redirigir: un bucle infinito de recargas.
//
// La redirección real la maneja ProtectedRoute (routes/ProtectedRoute.jsx)
// usando <Navigate> de React Router, que cambia de vista sin recargar
// el navegador. Este interceptor solo deja pasar el error para que quien
// hizo la petición decida qué hacer con él.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
