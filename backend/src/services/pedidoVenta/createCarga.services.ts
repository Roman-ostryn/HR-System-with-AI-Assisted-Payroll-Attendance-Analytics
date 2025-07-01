import { getConnection } from "typeorm";
import { generateInsertQuery } from "../../genericQueries/insertBuilder";
// import { format, parseISO } from 'date-fns';
// import getOneMarcacion from "./getOne.services";
import  getOneDta  from "../../services/interfoliacion/getOneSerie.services";
import { updateData } from "../../services/pedidoVenta/update.services";


// export async function insertDataCarga(tableName: string, data: Record<string, any>): Promise<any> {
//   // console.log("🚀 ~ insertDataCarga ~ data:", data)
//   const { serie, descripcion, id_pedido, cod_empresa, id_usuario, n_pedido, cantidad, id_vehiculo } = data;

  
//   let datosActualizados: Record<string, any> = {
//     // ...data,
//     id_pedido: id_pedido,
//     cod_empresa: cod_empresa,
//     id_usuario: id_usuario,
//     n_pedido: n_pedido,
//     cantidad: cantidad,
//     serie: serie,
//     id_vehiculo: id_vehiculo,
//   };

//     const serieValidate = await getOneDta("carga_pedido", serie);
//     // console.log("🚀 ~ insertDataCarga ~ serieValidate:", serieValidate)
//     if(serieValidate != null && descripcion != "Monolitico"){
//       throw new Error("Ya se Registro esta serie");
//     }

//     const update={
//       cantidad:serieValidate.cantidad + 1
//     }
//     // console.log("🚀 ~ insertDataCarga ~ update:", update)
//   // Generar la consulta de inserción
//   if(descripcion == "Monolitico" && serieValidate.id_vehiculo==id_vehiculo){
//     const response = updateData("carga_pedido", serieValidate.id, update)
//     // console.log("🚀 ~ insertDataCarga ~ response:", response)
//   }else{
//     const insertQuery = generateInsertQuery(tableName, datosActualizados);
//     // console.log("🚀 ~ insertData ~ insertQuery:", insertQuery)
  
//   try {
//     // Obtiene la conexión actual
//     const connection = getConnection();

//     // Ejecuta la consulta SQL y obtiene el resultado de la inserción
//     const result = await connection.query(`${insertQuery} RETURNING *`);
    
//     // console.log("🚀 ~ insertData ~ result:", result)
//     const insertedData = result[0];

//     console.log("Data inserted successfully:", insertedData);
//     return insertedData;

//   } catch (error) {
//     console.error("Error inserting data:", error);
//     throw error;
//   }
// }
// }


export async function insertDataCarga(tableName: string, data: Record<string, any>): Promise<any> {
  const { serie, descripcion, id_pedido, cod_empresa, id_usuario, n_pedido, cantidad, id_vehiculo } = data;

  let datosActualizados: Record<string, any> = {
    id_pedido,
    cod_empresa,
    id_usuario,
    n_pedido,
    cantidad,
    serie,
    id_vehiculo,
  };

  const serieValidate = await getOneDta("carga_pedido", serie);
  console.log("🚀 ~ insertDataCarga ~ serieValidate:", serieValidate)

  if (serieValidate) {
    if (descripcion !== "Monolitico") {
      throw new Error("Ya se registró esta serie");
    }
    
    if (serieValidate.id_vehiculo == id_vehiculo) {
      const update = { cantidad: serieValidate.cantidad + data.cantidad };
      await updateData("carga_pedido", serieValidate.id, update);
      return { message: "Registro actualizado correctamente" };
    }
  }

  // Si la serie no existe o es Monolítico sin coincidencia en id_vehiculo, insertar
  const insertQuery = generateInsertQuery(tableName, datosActualizados);

  try {
    const connection = getConnection();
    const result = await connection.query(`${insertQuery} RETURNING *`);
    const insertedData = result[0];

    console.log("Data inserted successfully:", insertedData);
    return insertedData;

  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}
