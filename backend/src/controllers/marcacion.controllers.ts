import { Request, Response } from "express";
import { insertData} from "../services/marcacion/Insert.services";
// import Garden from "../interface/garden";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData, getData1 } from "../genericQueries/getBuilder";
import { updateData, updateData1 } from "../services/marcacion/update.services";
// import Category from "../interface/category";
import User from "../interface/user";
import Marcacion from "../interface/marcacion";
import { insertSancion } from "../services/marcacion/InsertSancion.services";
import { getDataPlus } from "../services/marcacion/getBuilder";


export const createMarcacion = async (req: Request, res: Response) => {

  // console.log("llego en el controlador")
  const tableName = "marcacion"; // Reemplaza con el nombre de tu tabla
  const data: Marcacion = req.body;
  // console.log("datos recibidos controller",data);
  try {
    // console.log("data desde controlador",data)
    // Utiliza el servicio para insertar los datos
    const resp = await insertData(tableName, data);
    // console.log("respuesta insert",resp)

    res.json({ message: "Data inserted successfully", resp});
  } catch (error) {
    console.error("Error creating marcacion:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const createSanciones = async (req: Request, res: Response) => {
  const tableName = "marcacion"; // Reemplaza con el nombre de tu tabla
  const data: Marcacion = req.body;
  // console.log("datos recibidos controller",data);
  try {
    // console.log("data desde controlador",data)
    // Utiliza el servicio para insertar los datos
    const resp = await insertSancion(tableName, data);
    // console.log("respuesta insert",resp)

    res.json({ message: "Data inserted successfully", resp});
  } catch (error) {
    console.error("Error creating marcacion:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getMarcacion = async (req: Request, res: Response) => {
  const tableName = "marcacion"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getData(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getResumenView = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Missing date parameters" });
    }

    const userData = await getData1(startDate as string, endDate as string);
    res.json(userData);
  } catch (error) {
    console.error("Error getting data:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const saveOvertimeActivation = async (req: Request, res: Response) => {

  try {
    // Extract id_marcacion and aprobacion_horas_extras from request body
    const { id_marcacion, aprobacion_horas_extras } = req.body;

    // Validate input
    if (typeof id_marcacion === "undefined" || (aprobacion_horas_extras !== 0 && aprobacion_horas_extras !== 1)) {
      return res.status(400).json({ message: "Missing or invalid parameters: id_marcacion and aprobacion_horas_extras (0 or 1) required." });
    }

    // Call updateData to perform the update
    const updateResult = await updateData1(id_marcacion, aprobacion_horas_extras);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "No record found to update." });
    }

    return res.json({ message: "Approval status updated successfully." });
  } catch (error) {
    console.error("Error updating approval status:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown server error." });
  }
};

export const getSancionesView = async (req: Request, res: Response) => {
  const tableName = "plusView"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getDataPlus(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getMarcacionView = async (req: Request, res: Response) => {
  const tableName = "MarcacionesView"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getData(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
export const getDescuentoView = async (req: Request, res: Response) => {
  const tableName = "descuentosview"; // Reemplaza con el nombre de tu tabla

  try {
    const userData = await getData(tableName);
    res.json(userData);
  } catch (error) {
    console.error("Error getting marcacion data:", error);

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
export const updateMarcacion = async (req: Request, res: Response) => {
  const tableName = "marcacion";
  const newData: Marcacion = req.body;
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


export const getOneMarcacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "marcacion"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getOneData(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.error("Error getting data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteGarden = async (req: Request, res: Response) => {
  const tableName = "garden"; // Reemplaza con el nombre de tu tabla
  // const newData = req.body;
  const newData: User = req.body;
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