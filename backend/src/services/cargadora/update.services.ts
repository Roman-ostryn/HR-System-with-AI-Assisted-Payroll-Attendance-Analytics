
import { updateOrdenDat } from './updateOrden.services';
import { updateChapa } from './updateChapa.services';
import { getManager } from 'typeorm';
import { generateUpdateQuery } from '../../services/reporteLavadora/updateBuilder';
import { getVerificar } from '../../controllers/ordenProduccion.controllers';
import { getVerificarStock } from '../ordenProduccion/getVerificarStock.services';
import getOnePaquete from './getOne.services';
import {updateData2} from '../stock/update.services'
import getOnePaquet from './getOnePaquet.services';
import { error } from 'console';
import { channel } from 'diagnostics_channel';


export const updateDataOrden = async (tableName: string, id: any, newData: any): Promise<any> => {
  try {
    const entityManager = getManager();
    const update_at = new Date();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",newData)
    const { caballete1, caballete2, caballete3, caballete4, orden, cod, cantidad_total, Estado, estado_calandra,pvb,serie, chapa1, chapa2, ...restData } = newData;

    const updateDataT = {
      // ...newData,
      update_at,
      caballete1,
      caballete2,
      // caballete3,
      // caballete4,
      estado:Estado,
      estado_calandra:estado_calandra,
      pvb: pvb
    };


    const updateDataO = {
      // ...newData,
      update_at,
      // caballete1,
      // caballete2,
      // caballete3,
      // caballete4,
      estado:Estado,
      estado_calandra:estado_calandra,
      pvb: pvb
    };

    const objetoPerdido = {
      update_at,
      estado:3,
      estado_calandra:estado_calandra,
      pvb: pvb,
      chapa1: chapa1,
      chapa2: chapa2,
    };

  //  console.log("estado calandra xdxd",Estado)

   if(Estado === 2){
    const paquete = await  getOnePaquet("productos", cod );
    // console.log("paquete master =================================>",paquete)

       const verifyCod1 = await getOnePaquete("stock", caballete1);
      //  console.log("paquete master2 <=================================",verifyCod1)

       const verifyCod2 = await getOnePaquete("stock", caballete2);
      //  console.log("paquete master <=================================",verifyCod2)
      if(paquete.paquete2 === verifyCod1.cod && paquete.paquete3 === verifyCod2.cod){
        // console.log("si coinciden")
        const updateOrden = await updateOrdenDat(tableName, orden, Estado, updateDataT);
        // console.log("Cantidad total",updateOrden)
       }else{
        throw new Error("La Orden no Coinside con el paquete");
       }
      
   } else if(Estado === 1){
    const updateOrden = await updateOrdenDat(tableName, orden, Estado, updateDataO);
    // console.log("Cantidad total",updateOrden)


   }else if(Estado === 4){
    const Estado = 2;
    updateDataO.estado=2;
    const updateOrden = await updateOrdenDat(tableName, orden, Estado, updateDataO);
   
  
  
  }else if(Estado === 5){
    const updateOrden = await updateChapa(tableName, orden, serie, objetoPerdido);
   }
   

    // Generar la consulta de actualización
    //  const updateQuery = await generateUpdateQuery(tableName, id, updateData);
    const values = [...Object.values(updateData2), id];

    // Ejecutar la actualización
    // await entityManager.query(updateQuery, values);

    // Obtener todos los datos de la fila actualizada
    const selectQuery = `SELECT * FROM ${tableName} WHERE orden = ?`;
    const result = await entityManager.query(selectQuery, [orden]);

    // Retornar el resultado
    // return result[0];
    return result[0];
     // Se asume que `id` es único y solo habrá una fila
  } catch (error) {
    console.error("Error en la actualización:", error);
    throw error; // Propaga el error al llamador
  }
};
