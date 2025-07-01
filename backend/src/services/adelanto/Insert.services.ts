import { getConnection } from "typeorm";

export async function insertData(tableName: string, data: Record<string, any>): Promise<any> {
  const { monto } = data;

  if (typeof monto === "undefined") {
    throw new Error("Missing 'monto' field to update adelanto.");
  }

  try {
    const connection = getConnection();

    // Update adelanto for all rows without RETURNING clause
    const updateQuery = `UPDATE ${tableName} SET adelanto = ?`;
    await connection.query(updateQuery, [monto]);

    // Optionally, fetch all updated rows to return
    const selectQuery = `SELECT * FROM ${tableName}`;
    const updatedRows = await connection.query(selectQuery);

    return updatedRows;

  } catch (error) {
    console.error("Error updating adelanto for all users:", error);
    throw error;
  }
}