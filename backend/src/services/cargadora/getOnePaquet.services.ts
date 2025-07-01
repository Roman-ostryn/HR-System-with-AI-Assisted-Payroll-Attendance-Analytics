import { getConnection } from "typeorm";

 const getOnePaquet= async (tableName: string, cod: string): Promise<any | null> => {
  try {
    // Obtiene la conexión actual
    const connection = getConnection();

    // Ejecuta la consulta SQL para obtener un único registro por ID
    const result = await connection.query(`select
    id,
    cod,

    -- Concatenación para la primera chapa con producto modificado
  CONCAT(
        SUBSTRING_INDEX(p.cod, '+', 1),  
        REGEXP_SUBSTR(SUBSTRING_INDEX(p.cod, '+', -1), '[0-9]'),  -- Extrae solo el primer número (4 en este caso)
        'mm',
        SUBSTRING_INDEX(SUBSTRING_INDEX(p.cod, ' ', -2), '-', 1)  
    ) AS paquete2,

    -- Concatenación para la segunda chapa usando producto_parcial
    CONCAT(
        CONCAT(
            LEFT(SUBSTRING_INDEX(cod, '+', 1), 1), 
            '-',
            REGEXP_SUBSTR(SUBSTRING_INDEX(cod, '+', -1), '^[A-Za-z]+')
        ),
        SUBSTRING_INDEX(SUBSTRING_INDEX(REGEXP_SUBSTR(SUBSTRING_INDEX(cod, '+', -1), '[0-9]+'), '1', -1), ' ', 1),
        'mm',
        SUBSTRING_INDEX(SUBSTRING_INDEX(cod, ' ', -2), '-', 1)
    ) AS paquete3

FROM ${tableName} p
WHERE cod = ? ;`, [cod]);

    // console.log("resultado",result)
    // Verifica si se encontró un registro
    if (result && result.length > 0) {
      return result[0];
    } else {
      return null; // Devuelve null si no se encuentra ningún registro
    }
  } catch (error) {
    console.error("Error getting  data:", error);
    throw error;
  }
};
export default getOnePaquet;