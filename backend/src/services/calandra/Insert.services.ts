import { getConnection } from "typeorm";
import { generateInsertQuery } from "../../genericQueries/insertBuilder";
import { updateData } from "../grupos/update.services";
import { getOneSerieData } from "./getOneSerie.sevices";
import { error } from "console";


export async function insertData(tableName: string, data: Record<string, any>): Promise<any> {

  const { serie} = data;

  // Crear el objeto con los datos actualizados y formateados
  let datosActualizados: Record<string, any> = {
    serie: serie,
    ...data
  };

   const serieValidate = await getOneSerieData("calandra", serie);
  if(serieValidate != null){
    throw new Error("Ya Existe un Registro Con esta serie");
  }
  // Generar la consulta de inserción
  const insertQuery = generateInsertQuery(tableName, datosActualizados);

  try {
    // Obtener la conexión actual
    const connection = getConnection();

    // Ejecutar la consulta SQL y obtener el resultado de la inserción
    const result = await connection.query(`${insertQuery} RETURNING *`);
    const insertedData = result[0];

    // console.log("Data inserted successfully:", insertedData);
    

    return insertedData;

  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}