/**
 * El sistema original (funcionModel.php) llama a funcion_crear,
 * funcion_actualizar, funcion_index, funcion_encontrar y
 * funcion_cambiar_estado -- pero ninguno existía en el dump original de
 * la BD. Esta migración los crea, siguiendo el mismo patrón que
 * menu_crear/menu_actualizar/etc. (que sí existen y funcionan).
 */

export async function up(knex) {
  await knex.raw(`
    CREATE PROCEDURE funcion_crear(
      in Controlador varchar(60),
      in AccionP varchar(45),
      in AcronimoP varchar(30)
    )
    BEGIN
      INSERT INTO funciones (Controller, Accion, Acronimo, Estado)
      VALUES (Controlador, AccionP, AcronimoP, 1);
    END
  `);

  await knex.raw(`
    CREATE PROCEDURE funcion_actualizar(
      in Id_Consultar int,
      in Controlador varchar(60),
      in AccionP varchar(45),
      in AcronimoP varchar(30)
    )
    BEGIN
      UPDATE funciones
      SET Controller = Controlador, Accion = AccionP, Acronimo = AcronimoP
      WHERE Id = Id_Consultar;
    END
  `);

  await knex.raw(`
    CREATE PROCEDURE funcion_index()
    BEGIN
      SELECT * FROM funciones;
    END
  `);

  await knex.raw(`
    CREATE PROCEDURE funcion_encontrar(in Id_Consultar int)
    BEGIN
      SELECT * FROM funciones WHERE Id = Id_Consultar;
    END
  `);

  await knex.raw(`
    CREATE PROCEDURE funcion_cambiar_estado(in Id_Consultar int, in Estado_N tinyint)
    BEGIN
      UPDATE funciones SET Estado = Estado_N WHERE Id = Id_Consultar;
    END
  `);
}

export async function down(knex) {
  await knex.raw('DROP PROCEDURE IF EXISTS funcion_crear');
  await knex.raw('DROP PROCEDURE IF EXISTS funcion_actualizar');
  await knex.raw('DROP PROCEDURE IF EXISTS funcion_index');
  await knex.raw('DROP PROCEDURE IF EXISTS funcion_encontrar');
  await knex.raw('DROP PROCEDURE IF EXISTS funcion_cambiar_estado');
}
