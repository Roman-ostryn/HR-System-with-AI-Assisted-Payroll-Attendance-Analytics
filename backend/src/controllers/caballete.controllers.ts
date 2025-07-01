import { Request, Response } from "express";
import { createData} from "../services/caballete/create.services";
import { getChapasCab} from "../services/caballete/getChapasCaballete.services";
// import Garden from "../interface/garden";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData } from "../services/caballete/getBuilder";
import { updateData } from "../services/caballete/update.services";
// import Category from "../interface/category";
import Descuento from "../interface/descuento";
import HorasExtras from "../interface/horasExtras";
import Metas from "../interface/metas";
import Productos from "../interface/productos";


export const createCaballete = async (req: Request, res: Response) => {
  const tableName = "caballete"; // Reemplaza con el nombre de tu tabla
  const data: Productos = req.body;
  // console.log("datos recibidos controller",data);
  try {
    // Utiliza el servicio para insertar los datos
    const resp = await createData(tableName, data);
    // console.log("respuesta insert",resp)

    res.json({ message: "Data inserted successfully", resp});
  } catch (error) {
    console.error("Error creating marcacion:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getCaballete = async (req: Request, res: Response) => {
  const tableName = "caballete"; // Reemplaza con el nombre de tu tabla
  const { codigo } = req.query; // Extrae los parámetros de la consulta

  try {
    const codigoNumber = typeof codigo === 'string' ? Number(codigo) : undefined;

    if (codigoNumber !== undefined && (codigoNumber < 0 || codigoNumber > 3)) {
      return res.status(400).json({ message: 'El código debe ser 0 o 1.' });
    }

    const userData = await getData(tableName, codigoNumber);
    res.json(userData);
  } catch (error) {
    console.error("Error getting product data:", error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};



export const getCaballeteView = async (req: Request, res: Response) => {
  const tableName = "caballeteview"; // Reemplaza con el nombre de tu tabla

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

export const getCaballeteView2 = async (req: Request, res: Response) => {
  const tableName = "caballeteview2"; // Reemplaza con el nombre de tu tabla

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


export const getOneCaballete = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "caballete"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getOneData(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "caballete not found" });
    }
  } catch (error) {
    console.error("Error getting caballete data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};


export const getChapasCaballete = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "calandra"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getChapasCab(tableName, parseInt(id, 10));
    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "caballete not found" });
    }
  } catch (error) {
    console.error("Error getting caballete data:", error);

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



export const updateChapas = async (req: Request, res: Response) => {

  const tableName = "calandra";
  const id = req.params.id; // Asumiendo que el id está en los parámetros de la solicitud
  const data = {
    id_caballete: req.body.id_caballete
  }

  try {
    await updateData(tableName, id, data);

    res.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};


export const updateChapasOrd = async (req: Request, res: Response) => {

  const tableName = "orden_produccion";
  const id = req.params.id; // Asumiendo que el id está en los parámetros de la solicitud
  const data = {
    id_caballete: req.body.id_caballete
  }

  try {
    await updateData(tableName, id, data);

    res.json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};


export const updateCaballete = async (req: Request, res: Response) => {
  const tableName = "caballete";
  const data = req.body
  // console.log("🚀 ~ updateCaballete ~ data:", data)
  const id = req.body.id; // Asumiendo que el id está en los parámetros de la solicitud
  const newData = {
    estado: data.estado
  }
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