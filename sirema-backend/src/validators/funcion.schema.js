import { z } from 'zod';

// Basado en la tabla `funciones`: Controller varchar(60), Accion varchar(45),
// Acronimo varchar(30).
//
// ADVERTENCIA: funcionModel.php llama a funcion_crear, funcion_actualizar,
// funcion_index, funcion_encontrar y funcion_cambiar_estado, pero NINGUNO
// de esos 5 procedimientos existe en sirema_routines.sql. Antes de que tu
// service pueda usar este schema contra la BD real, necesitas crearlos.
// SQL sugerido (mismo patrón que menu_crear/menu_actualizar):
//
// CREATE PROCEDURE funcion_crear(in Controlador varchar(60), in Accion varchar(45), in Acronimo varchar(30))
// BEGIN
//   INSERT INTO funciones (Controller, Accion, Acronimo, Estado) VALUES (Controlador, Accion, Acronimo, 1);
// END;
//
// CREATE PROCEDURE funcion_actualizar(in Id_Consultar int, in Controlador varchar(60), in Accion varchar(45), in Acronimo varchar(30))
// BEGIN
//   UPDATE funciones SET Controller = Controlador, Accion = Accion, Acronimo = Acronimo WHERE Id = Id_Consultar;
// END;
//
// CREATE PROCEDURE funcion_index()
// BEGIN
//   SELECT * FROM funciones;
// END;
//
// CREATE PROCEDURE funcion_encontrar(in Id_Consultar int)
// BEGIN
//   SELECT * FROM funciones WHERE Id = Id_Consultar;
// END;
//
// CREATE PROCEDURE funcion_cambiar_estado(in Id_Consultar int, in Estado_N tinyint)
// BEGIN
//   UPDATE funciones SET Estado = Estado_N WHERE Id = Id_Consultar;
// END;

export const crearFuncionSchema = z.object({
  controlador: z.string().min(1).max(60),
  accion: z.string().min(1).max(45),
  acronimo: z.string().min(1).max(30),
});

export const actualizarFuncionSchema = crearFuncionSchema;
