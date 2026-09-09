// Con express-session, Express ya reconstruye req.session automáticamente
// a partir de la cookie que manda el navegador (igual que PHP hace con
// $_SESSION a partir de PHPSESSID). Este middleware solo verifica que
// haya un usuario guardado en esa sesión.

export function requireAuth(req, res, next) {
  if (!req.session?.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  next();
}
