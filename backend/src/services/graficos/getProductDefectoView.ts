import { getManager } from 'typeorm';

const getDataProduccionDefectoView = async (fecha: string): Promise<any | null> => {

    // console.log("============>",fecha)
  try {
    const entityManager = getManager();
    // Llamada al procedimiento almacenado
    const result = await entityManager.query(`CALL sp_reporte_clasificacion(?)`, [fecha]);
    
    // Verifica si hay resultados
    if (result.length > 0) {
      return result[0]; // Devolver los resultados del primer conjunto de resultados
    } else {
      return null; // Si no hay resultados
    }
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};

export default getDataProduccionDefectoView;