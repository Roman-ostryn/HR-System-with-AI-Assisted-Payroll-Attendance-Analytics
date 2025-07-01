
// import { response } from 'express';
// import { getManager } from "typeorm";
// import { generateUpdateQuery } from './updateBajaStock';
// import { getOneCamion } from "./getOneCamion.services";
// import getOne from "../../services/stock/getCodInterno.services";
// import getOneDta from "../../services/interfoliacion/getOneSerie.services";

// export const updateSalidaStoc = async (tableName: string, id: any): Promise<void> => {
//   try {
//     const entityManager = getManager();

//     // Obtener los datos del camión con las series y cantidades a descontar
//     const seriesProductos = await getOneCamion("carga_pedido", id);

//     if (!seriesProductos || seriesProductos.length === 0) {
//       throw new Error("No se encontraron productos para descontar.");
//     }

//     // Obtener la fecha actual
//     const update_at = new Date();

//     // Iterar sobre cada serie para actualizar individualmente
//     for (const producto of seriesProductos) {
//       const { serie, cantidad } = producto; // Asegúrate de que el servicio retorna `serie` y `cantidad`
     
//       const Producto = await getOne("stock", serie);
//       console.log("🚀 ~ updateSalidaStoc ~ Producto:", Producto)

//       if (!Producto) {
//         console.warn(`No se encontró el producto en Stock con serie: ${serie}`);
//         console.log("Buscando en Interfoliacion")
//         const inter = await getOneDta("interfoliacion", serie)
//         console.log("🚀 Encontrado en intefoliacion:", inter)
//         continue; // Si no encuentra el producto, pasa al siguiente
//       }

//     const data = {
//       update_at,
//       cantidad: Producto.cantidad - cantidad
//     };
//     console.log("🚀 ~ updateSalidaStoc ~ data:", data)

//     const updateQuery = await generateUpdateQuery(tableName, Producto.cod_interno, data);
//     console.log("🚀 ~ updateSalidaStoc ~ updateQuery:", updateQuery)

//     // Crear un array de valores con la serie al final
//     const values = [...Object.values(data), serie];

//     // Realiza la actualización en la base de datos con los valores formateados
//     await entityManager.query(updateQuery, values);
//     }

//     console.log("Stock actualizado correctamente.");
//   } catch (error) {
//     console.error("Error al actualizar el stock:", error);
//     throw error;
//   }
// };


import { getManager } from "typeorm";
import { generateUpdateBajarStock } from './updateBajaStock';
import { getOneCamion } from "./getOneCamion.services";
import getOne from "../../services/stock/getCodInterno.services";
import getOneDta from "../../services/interfoliacion/getOneSerie.services";
import {descuentoStock} from "../../services/stock/updateDescuentoStock";
import { getOneData } from "../../genericQueries/getOne.services";
import { getOneCamionChapa} from "../../services/pedidoVenta/getOne.services";
import { insertDataLiberarCarga} from "../../services/pedidoVenta/createLiberarCarga.services";

export const updateSalidaStoc = async (tableName: string, id: any): Promise<void> => {
  try {
    const entityManager = getManager();


    // Obtener los datos del camión con las series y cantidades a descontar
    const seriesProductos = await getOneCamion("carga_pedido", id);
    // console.log("🚀 ~ updateSalidaStoc ~ seriesProductos:", seriesProductos)

    if (!seriesProductos || seriesProductos.length === 0) {
      throw new Error("No se encontraron productos para descontar.");
    }
    const xd = await getOneData("truck", id)
    const pedidosCamion = await getOneCamionChapa("cargamento_view", xd.chapa)
    // console.log("🚀 ~ updateSalidaStoc ~ pedidosCamion:", pedidosCamion)

    if (pedidosCamion && pedidosCamion.length > 0) {
      const cod_empresa = 1; // Replace with actual cod_empresa
      const id_usuario = 1; // Replace with actual id_usuario
      const id_vehiculo = pedidosCamion[0].id_vehiculo;
      const n_pedido = pedidosCamion.map((p: { id: number }) => p.id).join(',');

      if (n_pedido.length >= 0) {
        const insertData = {
          cod_empresa,
          id_usuario,
          id_vehiculo,
          n_pedidos: n_pedido
        };
        await insertDataLiberarCarga("liberar_carga", insertData);
        console.log("Datos insertados correctamente en LiberarCarga.");
      } else {
        console.warn("No hay pedidos para insertar en LiberarCarga.");
      }
    }

    // Obtener la fecha actual
    const update_at = new Date();

    // Iterar sobre cada serie para actualizar individualmente
    for (const producto of seriesProductos) {
      const { serie, cantidad } = producto; // Asegúrate de que el servicio retorna `serie` y `cantidad`

      // Buscar primero en la tabla 'stock'
      let Producto = await getOne("stock", serie);
      // console.log("🚀 ~ updateSalidaStoc ~ Producto en stock:", Producto);

      if (!Producto) {
        console.warn(`No se encontró el producto en Stock con serie: ${serie}`);
        // Si no se encuentra en stock, buscar en 'interfoliacion'
        const inter = await getOneDta("interfoliacion", serie);
        // console.log("🚀 ~ updateSalidaStoc ~ Producto en interfoliacion:", inter);

        if (!inter) {
          console.warn(`No se encontró el producto en ninguna tabla (stock ni interfoliacion) con serie: ${serie}`);
          continue; // Si no se encuentra en ninguna de las dos tablas, continuar con el siguiente producto
        }

        // Si el producto se encuentra en interfoliacion, actualizar en esa tabla
        const data = {
          update_at,
          cantidad: inter.cantidad - cantidad,
        };

        const updateQuery = await descuentoStock("interfoliacion", inter.serie, data); // Usar la tabla interfoliacion
        const values = [...Object.values(data), inter.serie];

        // Realizar la actualización en la base de datos en la tabla interfoliacion
        await entityManager.query(updateQuery, values);
        console.log("Producto actualizado correctamente en Interfoliacion.");
        continue;
      }

      // Si se encuentra en stock, actualizar en esa tabla
      const data = {
        update_at,
        cantidad_entrada: Producto.cantidad - cantidad,
      };

      const updateQuery = await generateUpdateBajarStock("stock", Producto.cod_interno, data); // Usar la tabla stock
      const values = [...Object.values(data), Producto.cod_interno];

      // Realizar la actualización en la base de datos en la tabla stock
      await entityManager.query(updateQuery, values);
      console.log("Producto actualizado correctamente en Stock.");
    }

    console.log("Stock e interfoliacion actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    throw error;
  }
};
