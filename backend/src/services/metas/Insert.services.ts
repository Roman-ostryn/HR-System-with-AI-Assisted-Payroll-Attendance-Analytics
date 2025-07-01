import { getConnection } from "typeorm";
import { generateInsertQuery } from "../../genericQueries/insertBuilder";
import { updateData } from "../grupos/update.services";

export async function insertData(tableName: string, data: Record<string, any>): Promise<any> {
  const { id_grupo, id_plus, bono_produccion, motivo } = data;

  const connection = getConnection();

  // Prepare parameterized query and values
  const insertQuery = `INSERT INTO ${tableName} (id_grupo, id_plus, motivo, bono_produccion) VALUES (?, ?, ?, ?)`;
  const params = [id_grupo, id_plus, motivo, bono_produccion];

  try {
    // Execute insert query
    const result = await connection.query(insertQuery, params);

    // Get inserted ID (assuming your table has auto-increment 'id' column)
    const insertedId = result.insertId;

    // Optionally fetch the inserted row
    const [insertedData] = await connection.query(`SELECT * FROM ${tableName} WHERE id = ?`, [insertedId]);

    console.log("Data inserted successfully:", insertedData);

    if (id_plus === 1) {
      const datos = {
        status_plus: 1,
      };
      await updateData("grupos", id_grupo, datos);
    }

    return insertedData;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}