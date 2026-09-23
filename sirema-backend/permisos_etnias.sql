USE `sirema`;

-- Paso 0: identifica el Id de tu rol de prueba antes de continuar
SELECT * FROM roles;

-- Paso 1: define aquí el Id del rol al que le vas a asignar los permisos
-- (reemplaza el 1 por el Id real que viste en el SELECT de arriba)
SET @rolId = 1;

-- Paso 2: verifica que los acronimos de etnia todavía NO existan
-- (si esto devuelve filas, ya los tienes y no debes correr el Paso 3 de nuevo)
SELECT * FROM funciones WHERE Acronimo IN ('ETNIN', 'ETNCR', 'ETNUP', 'ETNCHS');

-- Paso 3: crear los 4 acronimos nuevos en el catálogo de funciones
INSERT INTO funciones (Controller, Accion, Acronimo, Estado) VALUES
  ('etniaController', 'index',        'ETNIN',  1),
  ('etniaController', 'insert',       'ETNCR',  1),
  ('etniaController', 'update',       'ETNUP',  1),
  ('etniaController', 'change_state', 'ETNCHS', 1);

-- Paso 4: asignar esos 4 permisos recién creados al rol definido en @rolId
INSERT INTO rol_funciones (Rol_Id, Funcion_Id)
SELECT @rolId, Id FROM funciones WHERE Acronimo IN ('ETNIN', 'ETNCR', 'ETNUP', 'ETNCHS');

-- Paso 5: verificación final -- deberías ver 4 filas
SELECT f.Acronimo, r.Nombre AS Rol
FROM rol_funciones rf
INNER JOIN funciones f ON f.Id = rf.Funcion_Id
INNER JOIN roles r ON r.Id = rf.Rol_Id
WHERE rf.Rol_Id = @rolId AND f.Acronimo IN ('ETNIN', 'ETNCR', 'ETNUP', 'ETNCHS');
