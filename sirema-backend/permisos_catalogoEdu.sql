-- Ajusta este Id antes de correr el script
SET @rolId = 1;

INSERT INTO funciones (Controller, Accion, Acronimo, Estado)
SELECT * FROM (SELECT 'anioCarreraController' AS c, 'index' AS a, 'ANCIN' AS ac, 1 AS e
  UNION ALL SELECT 'anioCarreraController', 'insert', 'ANCCR', 1
  UNION ALL SELECT 'anioCarreraController', 'update', 'ANCUP', 1
  UNION ALL SELECT 'anioCarreraController', 'change_state', 'ANCCHS', 1
  UNION ALL SELECT 'anioLectivoController', 'index', 'ANLIN', 1
  UNION ALL SELECT 'anioLectivoController', 'insert', 'ANLCR', 1
  UNION ALL SELECT 'anioLectivoController', 'update', 'ANLUP', 1
  UNION ALL SELECT 'anioLectivoController', 'change_state', 'ANLCHS', 1
  UNION ALL SELECT 'areaConocimientoController', 'index', 'ARCIN', 1
  UNION ALL SELECT 'areaConocimientoController', 'insert', 'ARCCR', 1
  UNION ALL SELECT 'areaConocimientoController', 'update', 'ARCUP', 1
  UNION ALL SELECT 'areaConocimientoController', 'change_state', 'ARCCHS', 1
  UNION ALL SELECT 'carreraController', 'index', 'CARIN', 1
  UNION ALL SELECT 'carreraController', 'insert', 'CARCR', 1
  UNION ALL SELECT 'carreraController', 'update', 'CARUP', 1
  UNION ALL SELECT 'carreraController', 'change_state', 'CARCHS', 1
  UNION ALL SELECT 'modalidadController', 'index', 'MODIN', 1
  UNION ALL SELECT 'modalidadController', 'insert', 'MODCR', 1
  UNION ALL SELECT 'modalidadController', 'update', 'MODUP', 1
  UNION ALL SELECT 'modalidadController', 'change_state', 'MODCHS', 1
  UNION ALL SELECT 'semestreController', 'index', 'SEMIN', 1
  UNION ALL SELECT 'semestreController', 'insert', 'SEMCR', 1
  UNION ALL SELECT 'semestreController', 'update', 'SEMUP', 1
  UNION ALL SELECT 'semestreController', 'change_state', 'SEMCHS', 1
  UNION ALL SELECT 'tipoIngresoController', 'index', 'TININ', 1
  UNION ALL SELECT 'tipoIngresoController', 'insert', 'TINCR', 1
  UNION ALL SELECT 'tipoIngresoController', 'update', 'TINUP', 1
  UNION ALL SELECT 'tipoIngresoController', 'change_state', 'TINCHS', 1
  UNION ALL SELECT 'grupoController', 'index', 'GRPIN', 1
  UNION ALL SELECT 'grupoController', 'insert', 'GRPCR', 1
  UNION ALL SELECT 'grupoController', 'update', 'GRPUP', 1
  UNION ALL SELECT 'grupoController', 'change_state', 'GRPCHS', 1
  UNION ALL SELECT 'turnoController', 'index', 'TURIN', 1
  UNION ALL SELECT 'turnoController', 'insert', 'TURCR', 1
  UNION ALL SELECT 'turnoController', 'update', 'TURUP', 1
  UNION ALL SELECT 'turnoController', 'change_state', 'TURCHS', 1
  UNION ALL SELECT 'tiposModalidadController', 'index', 'TMCNUIN', 1
  UNION ALL SELECT 'tiposModalidadController', 'insert', 'TMCNUCR', 1
  UNION ALL SELECT 'tiposModalidadController', 'update', 'TMCNUUP', 1
  UNION ALL SELECT 'tiposModalidadController', 'change_state', 'TMCNUCHS', 1
  UNION ALL SELECT 'matriculadoController', 'index', 'MATRIN', 1
  UNION ALL SELECT 'matriculadoController', 'insert', 'MATRCR', 1
  UNION ALL SELECT 'matriculadoController', 'anular', 'MATRCHS', 1
  UNION ALL SELECT 'reporteController', 'index', 'REPIN', 1
) AS nuevos
WHERE NOT EXISTS (
  SELECT 1 FROM funciones f WHERE f.Acronimo = nuevos.ac
);

-- Asigna TODOS los acronimos (más los que ya tenías, si corres esto de
-- nuevo no duplica gracias al WHERE NOT EXISTS)
INSERT INTO rol_funciones (Rol_Id, Funcion_Id)
SELECT @rolId, f.Id
FROM funciones f
WHERE f.Acronimo IN (
  'ANCIN','ANCCR','ANCUP','ANCCHS',
  'ANLIN','ANLCR','ANLUP','ANLCHS',
  'ARCIN','ARCCR','ARCUP','ARCCHS',
  'CARIN','CARCR','CARUP','CARCHS',
  'MODIN','MODCR','MODUP','MODCHS',
  'SEMIN','SEMCR','SEMUP','SEMCHS',
  'TININ','TINCR','TINUP','TINCHS',
  'GRPIN','GRPCR','GRPUP','GRPCHS',
  'TURIN','TURCR','TURUP','TURCHS',
  'TMCNUIN','TMCNUCR','TMCNUUP','TMCNUCHS',
  'MATRIN','MATRCR','MATRCHS','REPIN'
)
AND NOT EXISTS (
  SELECT 1 FROM rol_funciones rf WHERE rf.Rol_Id = @rolId AND rf.Funcion_Id = f.Id
);

-- Verificación: deberías ver 44 filas
SELECT COUNT(*) AS permisos_asignados
FROM rol_funciones rf
INNER JOIN funciones f ON f.Id = rf.Funcion_Id
WHERE rf.Rol_Id = @rolId
AND f.Acronimo IN (
  'ANCIN','ANCCR','ANCUP','ANCCHS','ANLIN','ANLCR','ANLUP','ANLCHS',
  'ARCIN','ARCCR','ARCUP','ARCCHS','CARIN','CARCR','CARUP','CARCHS',
  'MODIN','MODCR','MODUP','MODCHS','SEMIN','SEMCR','SEMUP','SEMCHS',
  'TININ','TINCR','TINUP','TINCHS','GRPIN','GRPCR','GRPUP','GRPCHS',
  'TURIN','TURCR','TURUP','TURCHS','TMCNUIN','TMCNUCR','TMCNUUP','TMCNUCHS',
  'MATRIN','MATRCR','MATRCHS','REPIN'
);
