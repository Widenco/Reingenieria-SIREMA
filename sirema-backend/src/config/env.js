// Falla rápido si falta una variable de entorno crítica, en vez de descubrirlo
// a medias en producción (como hoy pasaría con credenciales hardcodeadas mal puestas).

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'SESSION_SECRET'];

export function validarEnv() {
  const faltantes = required.filter((key) => !process.env[key]);
  if (faltantes.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${faltantes.join(', ')}. Revisa tu .env`
    );
  }
}
