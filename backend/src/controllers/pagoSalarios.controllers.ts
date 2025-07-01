import { Request, Response } from "express";
// import Garden from "../interface/garden";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData } from "../genericQueries/getBuilder";
//import { getOneSalarios } from "../services/salarios/getOne.services";
// import Category from "../interface/category";
import Descuento from "../interface/descuento";
import Grupos from "../interface/grupos";
import Salario from "../interface/salarios";
import { insertData } from "../services/pagos/Insert.services";
import { updateData } from "../services/salarios/update.services";
import Pagos from "../interface/pagos";

import { getConnection } from "typeorm";

export const createPago = async (req: Request, res: Response) => {
  const tableName = "pagosalarios";
  const data: Pagos = req.body;

  try {
    const connection = getConnection();

    // Fetch firstname, lastname, cedula, and id_grupo from user
    const userResult = await connection.query(
      `SELECT firstname, lastname, cedula, id_grupo FROM user WHERE id = ?`,
      [data.id_usuario]
    );

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstname, lastname, cedula, id_grupo } = userResult[0];
    const nombre = `${firstname} ${lastname}`;

    // Fetch group description
    const grupoResult = await connection.query(
      `SELECT descripcion FROM grupos WHERE id = ?`,
      [id_grupo]
    );

    if (!grupoResult || grupoResult.length === 0) {
      return res.status(404).json({ message: "Grupo not found" });
    }

    const grupo = grupoResult[0].descripcion;

    // Prepare data to insert including cedula
    const dataToInsert = {
      ...data,
      nombre,
      grupo,
      cedula,
    };

    // Insert into pagosalarios
    const resp = await insertData(tableName, dataToInsert);

    res.json({ message: "Data inserted successfully", resp });
  } catch (error) {
    console.error("Error creating pago:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getPagos = async (req: Request, res: Response) => {
  const tableName = "pagosalarios"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getData(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting  data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getAguinaldoIpsView = async (req: Request, res: Response) => {
  const tableName = "aguinaldoIpsView"; // Reemplaza con el nombre de tu tabla

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

export const getAguinaldoRealView = async (req: Request, res: Response) => {
  const tableName = "aguinaldoRealView"; // Reemplaza con el nombre de tu tabla

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
export const updateSalarios = async (req: Request, res: Response) => {
  const tableName = "salarios";
  const newData: Grupos = req.body;
  const id = req.params.id; // Asumiendo que el id está en los parámetros de la solicitud
// console.log(newData);
// console.log(id)
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


export const getOneSalarios = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "salarios"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getOneData(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "salarios not found" });
    }
  } catch (error) {
    console.error("Error getting salarios data:", error);

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