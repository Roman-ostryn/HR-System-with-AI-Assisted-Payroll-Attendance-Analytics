import { Request, Response } from "express";
import { createData} from "../services/entradaNotaFiscal/create.services";
import { getOneData } from "../genericQueries/getOne.services";
import { deleteGardenData } from "../services/delete.services";
import { getData } from "../genericQueries/getBuilder";
import { updateData } from "../services/descuento/update.services";
// import Category from "../interface/category";
import Descuento from "../interface/descuento";
import Productos from "../interface/productos";
import { insertData} from "../services/stock/Insert.services";
import { getVerify } from "../services/stock/getVerifyNota.services";
import { getVerifyStock } from "../services/stock/getVerifyStock.services";
import Stock from "../interface/stock";


// export const createEntradaNotalFiscal = async (req: Request, res: Response) => {
//   const tableName = "entradaNotaFiscal"; // Reemplaza con el nombre de tu tabla
//   const data: Productos = req.body;
//   const data1=req.body;

//   try {
//     // Utiliza el servicio para insertar los datos
//     const resp = await createData(tableName, data);
//     // console.log("🚀 ~ createEntradaNotalFiscal ~ resp:", resp)

//     data1.data[0].id_notafiscal=resp.id
//     await insertData("stock", data1.data);
//     // console.log("respuesta insert",resp)

//     res.json({ message: "Data inserted successfully", resp});
//   } catch (error) {
//     console.error("Error creating marcacion:", error);

//     if (error instanceof Error) {
//       return res.status(500).json({ message: error.message });
//     }
//   }
// };

export const createEntradaNotalFiscal = async (req: Request, res: Response) => {
  const tableName = "entradaNotaFiscal"; // Reemplaza con el nombre de tu tabla
  const data: Productos = req.body;
  const data1=req.body;
  const { numeroNota } = data1;

  const serieValidate = await getVerify(tableName, numeroNota);
  if(serieValidate != null){
    return res.status(400).json({ message: "Ya Existe un Registro con esta Nota Fiscal" });
  }
  
  try {
    // Utiliza el servicio para insertar los datos
    const resp = await createData(tableName, data);
    // console.log("🚀 ~ createEntradaNotalFiscal ~ resp:", resp)

    // Iterar sobre cada elemento del arreglo y actualizar el id_notafiscal
    data1.data.forEach((item: any) => {
      item.id_notafiscal = resp.id;
    });

    await insertData("stock", data1.data);
    // console.log("respuesta insert",resp)

    res.json({ message: "Data inserted successfully", resp});
  } catch (error) {
    console.error("Error creating nota fiscal:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};


export const getOneNotaFiscal = async (req: Request, res: Response) => {
  const numeroNota = req.params.nota;
 
  const tableName = "entradaNotaFiscal"; // Reemplaza con el nombre de tu tabla
  try {
    const Data = await getVerify(tableName, parseInt(numeroNota));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "Nota Fiscal not found" });
    }
  } catch (error) {
    console.error("Error getting garden data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getOneStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "stock"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getVerifyStock(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "Nota Fiscal not found" });
    }
  } catch (error) {
    console.error("Error getting garden data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getOneStockPVB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = "ticketpvb"; // Reemplaza con el nombre de tu tabla

  try {
    const Data = await getVerifyStock(tableName, parseInt(id, 10));

    if (Data) {
      res.json(Data);
    } else {
      res.status(404).json({ message: "Nota Fiscal not found" });
    }
  } catch (error) {
    console.error("Error getting garden data:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getEntradaNotalFiscal = async (req: Request, res: Response) => {
  const tableName = "entradaNotaFiscal"; // Reemplaza con el nombre de tu tabla
  const { codigo } = req.query; // Extrae los parámetros de la consulta

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



// export const getOneDescuento = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const tableName = "descuento"; // Reemplaza con el nombre de tu tabla

//   try {
//     const Data = await getOneData(tableName, parseInt(id, 10));

//     if (Data) {
//       res.json(Data);
//     } else {
//       res.status(404).json({ message: "descuento not found" });
//     }
//   } catch (error) {
//     console.error("Error getting garden data:", error);

//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };