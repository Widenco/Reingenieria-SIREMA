# SIREMA - Reingeniería (punto de partida)

Este paquete contiene el esqueleto inicial de los dos proyectos de la reingeniería:

- `sirema-backend/` — API REST en Node/Express, con el middleware de RBAC
  (`requirePermission`) y la migración Knex que crea `roles`, `rol_funciones`
  y `rol_menu`.
- `sirema-frontend/` — SPA en React/Vite, con el Context de sesión y el
  sidebar dinámico que consume el menú resuelto por rol.

## Cómo levantar el backend

```bash
cd sirema-backend
npm install
npm run dev
```

En caso de no haber reconstruido correctamente la base de datos o de estar
desactualizado utilizar el siguiente comando antes de correr el sistema:

```bash
npm run migrate
```

## Cómo levantar el frontend

```bash
cd sirema-frontend
npm install
npm run dev
```

## Nota:

El sistema usa variables de entorno dentro del .env para funcionar correctamente
asegurar de rellenar correctamente las credenciales dentro del archivo, el sistema
avisa automaticamente que las credenciales estan incompletas o que no existen.

## Qué falta por completar (a repartir entre el equipo)

- Vistas de Catalogos y sus respectivas vistas de modulos
- Modulos de Catalogos Educacion en el backend y sus respectivas vistas
- Modulos de Matricula y Reporte, asi como sus vistas

Ver la guía paso a paso de migración de base de datos y la estructura de
carpetas completa acordada por el equipo para más contexto.
