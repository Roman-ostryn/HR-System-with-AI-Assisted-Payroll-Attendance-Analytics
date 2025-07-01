import { Request, Response } from "express";
import { insertData} from "../services/calandra/Insert.services";
// import Garden from "../interface/garden";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData } from "../genericQueries/getBuilder";
import { updateData } from "../services/descuento/update.services";
// import Category from "../interface/category";
import Descuento from "../interface/descuento";
import HorasExtras from "../interface/horasExtras";
import Metas from "../interface/metas";
import Productos from "../interface/productos";
import getDataProduccionView from "../services/graficos/getProduccionView";
import getDataClasificacionView from "../services/graficos/getClasificacionView";
import getDataProduccionDefectoView from "../services/graficos/getProductDefectoView";
import getDataProduccionListView from "../services/graficos/getProduccionListView";
import getDataInterfoliacionView from "../services/graficos/getInterfoliacionView";


export const createCalandra = async (req: Request, res: Response) => {
  const tableName = "calandra"; // Reemplaza con el nombre de tu tabla
  const data: Productos = req.body;
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

export const getPvb= async (req: Request, res: Response) => {
  const tableName = "pvb"; // Reemplaza con el nombre de tu tabla

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

export const getCantidadView = async (req: Request, res: Response) => {
  // const tableName = "cantidadView"; // Reemplaza con el nombre de tu tabla

  const data = req.body;
  const fecha = data.fecha;
  try {
    const userData = await getDataClasificacionView(fecha);
    res.json(userData);
  } catch (error) {
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getClasificacionView = async (req: Request, res: Response) => {
  // const tableName = "reporteClasificacionView"; // Reemplaza con el nombre de tu tabla
  const data = req.body;
  const fecha = data.fecha;
  // console.log("🚀 ~ getClasificacionView ~ fecha:", fecha)

  try {
    const userData = await getDataProduccionDefectoView(fecha);
    res.json(userData);
  } catch (error) {
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }

};

export const getInterfoliacionView = async (req: Request, res: Response) => {
  // const tableName = "reporteClasificacionView"; // Reemplaza con el nombre de tu tabla
  const data = req.body;
  const fecha = data.fecha;
  // console.log("🚀 ~ getClasificacionView ~ fecha:", fecha)

  try {
    const userData = await getDataInterfoliacionView(fecha);
    res.json(userData);
  } catch (error) {
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }

};

export const getProduccionView = async (req: Request, res: Response) => {
  // const tableName = "ProduccionView"; // Reemplaza con el nombre de tu tabla
  const data = req.body;
  //  console.log("🚀 ~ getProduccionView ~ data:", data)

  const fecha = data.fecha;
  // console.log("🚀 ~ getProduccionView ~ fecha:", fecha)
  try {
    const Data = await getDataProduccionView(fecha);
    res.json(Data);
  } catch (error) {
    console.error("Error getting product data:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
export const getReportesView = async (req: Request, res: Response) => {
  const tableName = "reporteView"; // Reemplaza con el nombre de tu tabla
  const data = req.body;
  // console.log("🚀 ~ getProduccionView ~ data:", data)

  const fecha = data.fecha;
  // console.log("🚀 ~ getProduccionView ~ fecha:", fecha)
  try {
    const userData = await getDataProduccionListView(fecha);
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