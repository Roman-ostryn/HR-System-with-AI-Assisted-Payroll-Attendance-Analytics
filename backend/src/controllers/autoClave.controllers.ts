
import { Request, Response } from "express";
import { insertData} from "../services/autoClave/Insert.services";
import { insertDataLog} from "../services/autoClave/InsertLog.services";
// import {getLastFileData } from "../services/autoClave/getAutoClave.services";
import {monitorFileData } from "../services/autoClave/getAutoClave.services";

// import Garden from "../interface/garden";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData } from "../genericQueries/getBuilder";
import { updateData } from "../services/autoClave/update.services";
// import Category from "../interface/category";
// import Descuento from "../interface/descuento";
// import HorasExtras from "../interface/horasExtras";
import AutoClave from "../interface/autoClave";
import { getLastFile } from "../services/autoClave/getUltimaReceta.services";
import  getOne from "../services/autoClave/getOne.services";

export const createAutoClave = async (req: Request, res: Response) => {
  const tableName = "autoClave"; // Reemplaza con el nombre de tu tabla
  const data: AutoClave = req.body;
  const newData = {
    estado: data.estado
  }
  // console.log("datos recibidos controller",data);
  try {
    const resp = await insertData(tableName, data);
    updateData("caballete", parseInt(resp.primerCaballete), newData)

    if(resp.segundoCaballete != 163){
      updateData("caballete", parseInt(resp.segundoCaballete), newData)
    }

    res.json({ message: "Data inserted successfully", resp});
  } catch (error) {
    console.error("Error creating marcacion:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};



export const getAutoClave = async (req: Request, res: Response) => {
  const tableName = "autoClave"; // Reemplaza con el nombre de tu tabla

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

export const getAutoClaveLog = async (req: Request, res: Response) => {
  const tableName = "log_autoclave"; // Reemplaza con el nombre de tu tabla

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

export const getAutoClaveLogDes = async (req: Request, res: Response) => {
  const tableName = "autoclave_logview"; // Reemplaza con el nombre de tu tabla

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

export const getAutoClaveHistorial = async (req: Request, res: Response) => {
  // try {
  //   // const userData = await monitorFileData();

  //   if (!userData) {
  //     console.error('❌ No se encontraron datos.');
  //     return res.status(404).json({ message: 'No se encontraron datos en el archivo.' });
  //   }

  //   // console.log('📊 Datos obtenidos:', JSON.stringify(userData, null, 2));

  //   res.json(userData);

  //   // Insertar en la base de datos
  //   insertDataLog("log_autoclave", userData).catch(err =>
  //     console.error("❌ Error insertando en la base de datos:", err)
  //   );
  // } catch (error: any) {
  //   console.error('❌ Error al obtener datos del autoclave:', error);
  //   return res.status(500).json({ message: 'Error interno del servidor' });
  // }
};




// // Controlador Express para obtener el historial del autoclave
// export const getAutoClaveHistorial = async (req: Request, res: Response) => {
//   try {
//     const userData = await getLastFileData();

//     if (!userData) {
//       console.error('❌ No se encontraron datos.');
//       return res.status(404).json({ message: 'No se encontraron datos en el archivo.' });
//     }

//     // console.log('📊 Datos obtenidos:', JSON.stringify(userData, null, 2));


//     res.json(userData);
//     insertDataLog("log_autoclave", userData).catch(err =>
//       console.error("Error inserting data log:", err)
//     );
//   } catch (error: any) {
//     console.error('❌ Error al obtener datos del autoclave:', error);
//     return res.status(500).json({ message: 'Error interno del servidor' });
//   }
// };


// Controlador Express para obtener el historial del autoclave
export const getLastRecipe = async (req: Request, res: Response) => {
  try {
    const userData = await getLastFile();

    if (!userData) {
      console.error('❌ No se encontraron datos.');
      return res.status(404).json({ message: 'No se encontraron datos en el archivo.' });
    }

    // console.log('📊 Datos obtenidos:', JSON.stringify(userData, null, 2));


    res.json(userData);
    insertDataLog("lastrecipe", userData).catch(err =>
      console.error("Error inserting data log:", err)
    );
  } catch (error: any) {
    console.error('❌ Error al obtener datos del autoclave:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};



// tu controlador
export const updateAutoClave = async (req: Request, res: Response) => {
  const tableName = "autoClave";
  const newData: AutoClave = req.body;
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


export const getOneAutoClave = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "autoClave"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getOneData(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "AutoClave not found" });
    }
  } catch (error) {
    console.error("Error getting AutoClave data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getOneProceso = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "log_autoclave"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getOne(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "AutoClave not found" });
    }
  } catch (error) {
    console.error("Error getting AutoClave data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// export const deleteGarden = async (req: Request, res: Response) => {
//   const tableName = "garden"; // Reemplaza con el nombre de tu tabla
//   // const newData = req.body;
//   const newData: AutoClave = req.body;
//   const id = req.params;

//   try {
//     await deleteGardenData(tableName, newData, id);

//     res.json({ message: "Data delete successfully", newData });
//   } catch (error) {
//     console.error("Error deleting garden data:", error);

//     if (error instanceof Error) {
//       return res.status(500).json({ message: error.message });
//     }
//   }
// };