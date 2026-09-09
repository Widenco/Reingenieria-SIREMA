// Ejemplo de prueba a completar: valida que un rol sin la función asignada
// reciba 403, y uno con la función asignada pase. Sustento concreto de que
// el RBAC funciona, útil para la sustentación del proyecto.

describe('requirePermission middleware', () => {
  it.todo('responde 401 si no hay usuario autenticado');
  it.todo('responde 403 si el rol no tiene la función asignada en rol_funciones');
  it.todo('llama next() si el rol sí tiene la función asignada');
});
