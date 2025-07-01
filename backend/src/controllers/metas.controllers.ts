import { Request, Response } from "express";
import { insertData} from "../services/metas/Insert.services";
// import Garden from "../interface/garden";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData } from "../genericQueries/getBuilder";
import { updateData } from "../services/descuento/update.services";
// import Category from "../interface/category";
import Descuento from "../interface/descuento";
import HorasExtras from "../interface/horasExtras";
import Metas from "../interface/metas";
import { getConnection } from "typeorm";

export const createMeta = async (req: Request, res: Response) => {
  const tableName = "metas";
  const data: Metas = req.body;

  try {
    // Insert meta record
    const insertedMeta = await insertData(tableName, data);

    const connection = getConnection();

    // Update all users in the group with group bonus and timestamp
    await connection.query(
      `UPDATE \`user\` SET production_bonus = ?, production_bonus_created_at = NOW() WHERE id_grupo = ?`,
      [data.bono_produccion, data.id_grupo]
    );

    // If special user bonuses exist, override those users individually
    if (data.specialUserBonuses && data.specialUserBonuses.length > 0) {
      for (const specialBonus of data.specialUserBonuses) {
        await connection.query(
          `UPDATE \`user\` SET production_bonus = ?, production_bonus_created_at = NOW() WHERE id = ?`,
          [specialBonus.bonus, specialBonus.userId]
        );
      }
    }

    return res.json({ message: "Data inserted and users updated successfully", insertedMeta });
  } catch (error) {
    console.error("Error creating meta:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getMetas= async (req: Request, res: Response) => {
  const tableName = "metas"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getData(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getMetasView = async (req: Request, res: Response) => {
  const tableName = "metasView"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getData(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getProductView = async (req: Request, res: Response) => {
  const tableName = "productView"; // Reemplaza con el nombre de tu tabla

  try {
    const gardenData = await getData(tableName);
    res.json(gardenData);
  } catch (error) {    
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

// tu controlador
export const updateDescuento = async (req: Request, res: Response) => {
  const tableName = "descuento";
  const newData: Descuento = req.body;
  const id = req.params.id; // Asumiendo que el id está en los parámetros de la solicitud

  try {
    await updateData(tableName, id, newData);

    res.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};


export const getOneDescuento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "descuento"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getOneData(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "descuento not found" });
    }
  } catch (error) {
    console.error("Error getting garden data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteGarden = async (req: Request, res: Response) => {
  const tableName = "garden"; // Reemplaza con el nombre de tu tabla
  // const newData = req.body;
  const newData: Descuento = req.body;
  const id = req.params;

  try {
    await deleteGardenData(tableName, newData, id);

    res.json({ message: "Data delete successfully", newData });
  } catch (error) {
    console.error("Error deleting garden data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};