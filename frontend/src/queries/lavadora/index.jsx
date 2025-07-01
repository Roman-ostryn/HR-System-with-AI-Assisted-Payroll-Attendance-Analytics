import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { requestListTruckView } from "../../services/trukSocket.services";
import { Box, Typography, useTheme, Button } from "@mui/material";

import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { format, set, setYear } from "date-fns";
import { getProduccionView, updateLavadora } from "../../services/lavadoraSocket.services";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import ReporteLavadora from "../../registration/reporteLavadora";
import { es } from "date-fns/locale";
import ModalLavadoraStar from "../../modal/lavadora start/modalLavadora";
import { getOneOrdenProduccionxd, getOrdenOne } from "../../services/ordenProduccion.services";
// import {  } from "../../services/ordenProduccion.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOne, putDescuentoStock} from "../../services/stock.services";
import VerticalShadesClosedIcon from '@mui/icons-material/VerticalShadesClosed';
import { getOneDatosCargadoraCab } from "../../services/cargadora.services";
import ModalCharge from "../../modal/modalCharge";
import ModalSuccess from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import getUrlSocket from '../../utils/getUrlSocket';

const SOCKET_URL = getUrlSocket();
console.log("🚀 ~ SOCKET_URL:", SOCKET_URL)
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  query: {
    token: localStorage.getItem("authToken"),
  },
});

const Lavadora = ({ onDataParseChange }) => {
  const [data, setData] = useState([]);
  const [dataParse, setParse] = useState({});
  const [filteredData, setFilteredData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonEnable, setButtonEnable] = useState(true);
  const [buttonStop, setButtonStop] = useState(false);
  const [orderChange, setOrderChange] = useState(null);
  const [selectedCaballetes, setSelectedCaballetes] = useState([]);
  const [botonesDeshabilitados, setBotonesDeshabilitados] = useState(true); // Estado para desactivar botones
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);


  const [updateStatus, setUpdateStatus] = useState({
    estado: 2,
  });

  const [caballetesA, setCaballetesA] = useState({
    car1A: 171,
    car2A: 173,
    car3A: 175,

  });

  const [caballetesB, setCaballetesB] = useState({
    car1B: 172,
    car2B: 174,
    car3B: 176,
  });



  const [paquetes, setPaquetes] = useState({ paqueteA: null, paqueteB: null });

// console.log("paquetes",paquetes)

const handleCloseModalError = () => {
  setRegistrationError(false);
};
const handleCloseModalS = () => {
  setRegistrationSuccess(false);
  setButtonEnable(false);
  //  buttonEnabled(false); 
  setRegistrationSuccess(false);

  // resetForm();
};

console.log("dataparse",dataParse)
  const [selectData, setSelectData] = useState({
    id: "",
    orden: "",
    cod: "",
    cantidad_total: "0",
    producidos: "0",
    Estado: "Seleccione una Orden",
    lote: "Seleccione una Orden",
    descripcion: "Seleccione una Orden",
    pvb: "Seleccione una Orden",
    create_at: "Seleccione una Orden",
    estado_calandra: 0
  });

useEffect(() => {
    socket.on('ProduccionUpdated', (data) => {
      console.log('Datos recibidos desde el Socket:', data.response);

      if (data.response && data.response.orden) {
        const orden = data.response.orden;
        const paquete1 = localStorage.getItem("paquete1")
        const paquete2 = localStorage.getItem("paquete2")

        dataxd(orden)
        if (paquete1) {
          veririfyPaquete(paquete1);
        }

        if (paquete2) {
          veririfyPaquete(paquete2);
        }
      } else {
        console.warn("No se recibió una orden válida desde el socket.");
      }
    });
    return () => {
      socket.off('ProduccionUpdated');
    };
  }, []);


// Recuperar la orden guardada al cargar la página
useEffect(() => {
  const ordenGuardada = localStorage.getItem("orden");
  const EstadoGuardada = localStorage.getItem("Estado");
  const EstadoCalandra = localStorage.getItem("estado_calandra");

  
  if (ordenGuardada) {
    setSelectData((prevState) => ({
      ...prevState,
      orden: ordenGuardada || "",
      // Estado: EstadoGuardada,
      // estado_calandra: EstadoCalandra
      
    }));
    if (EstadoGuardada === "1") {
      setButtonStop(true);
      setButtonEnable(false);
    }else if (EstadoGuardada === "0") {
      setButtonStop(false);
      setButtonEnable(true);
  }
  }
}, []);

// Guardar la orden en localStorage cuando cambie dataParse
useEffect(() => {
  if (dataParse.orden) {
    localStorage.setItem("orden", dataParse.orden);
    // localStorage.setItem("estado_calandra", 0);
    // localStorage.setItem("Estado", dataParse.Estado);

  }
}, [dataParse]);

// Actualizar dataParse cuando selectData cambia
useEffect(() => {
  setParse(selectData);
}, [selectData]);
  

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "orden",
      headerName: "Orden Produccion",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "cod",
      headerName: "Producto",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Estado",
      headerName: "Estado",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];


  // console.log("orden xsxd", orderChange)
  useEffect(() => {
    // Si ambos paquetes son null, deshabilitar botones
    const deshabilitarBotones = paquetes.paqueteA === null && paquetes.paqueteB === null;
  
    // Actualizar estado de botones deshabilitados
    setBotonesDeshabilitados(deshabilitarBotones);
  
    // Forzar re-renderizado de los estilos de los botones
    if (deshabilitarBotones) {
      setSelectedCaballetes([]); // Vacía la selección para que los estilos se reseteen correctamente
    }
  }, [paquetes]); 
  


  useEffect(() => {

    const fetchData = async () => {

      const order = localStorage.getItem("orden");
      const Estado = localStorage.getItem("Estado");
      const lote = localStorage.getItem("lote");
      let Orden = dataParse.orden || order;
      try {
        if(order === "0" && Estado === "1"){
          fetchDataList();
        }else{
          // console.log("🚀 ~ fetchData ~ dataParse.orden:", Orden)

          const datos = await getOneOrdenProduccionxd(Orden);
  
        if (datos) {
          setData([datos]);
          setSelectData({...datos, lote});
          // const filtered = datos.find((item) => item.id_hangar === 1);
          // setFilteredData(filtered ? { ...filtered } : null);
        }
        }
        
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };
    
    if (dataParse.orden === null || dataParse.orden === undefined) {
    }else{
      fetchData(); 
    }
  
  }, [buttonEnable])

    // Verifica el localStorage y obtiene la orden al cargar la página


  const handleToggle = () => {

    setToggle(false);
  };


  const handleRowDoubleClick = useCallback((params) => {
    const selectedOrden = params.row;
    localStorage.setItem("toggle", false);
    handleToggle();
    // Extraer y formatear la fecha
    const { create_at, orden, Estado} = selectedOrden;
    const formattedDate = format(new Date(create_at), "dd/MM/yyyy-HH:mm", {
      locale: es,
    });
    const lote = `${orden}-${formattedDate}`;
    localStorage.setItem("lote", lote);
    // Actualizar el estado
    setSelectData((prevState) => ({
      ...prevState, // Mantener valores existentes
      ...selectedOrden, // Agregar/actualizar valores provenientes de la fila seleccionada
      create_at: formattedDate, // Sobrescribir `create_at` con la fecha formateada
      lote,
      Estado:1,
      estado_calandra:0,
      // pvb:0
    }));
    

  }, []);



  useEffect(() => {
   
    const dataToParse =  () => {
      setParse(selectData)
    }
    dataToParse();
    
  }, [selectData])
  


  const handleButtonStatus = (value) => {
    setButtonEnable(value); // Guardar el valor en el estado
  };


  const handleOrderChange = (value) => {
    setOrderChange(value); // Guardar el valor en el estado
  };
  // Calcular el progreso como porcentaje
  const progress = (selectData.producidos / selectData.cantidad_total) * 100;




  const dataxd = async (orden) => {
    if(orden){
      // console.log("🚀 ~ dataxd ~ orden:", orden)
      const datos = await getOrdenOne(orden);
      setSelectData(prevState => ({
        ...prevState,
        producidos: parseInt(datos.producidos),
        cantidad_total: parseInt(datos.cantidad_total)
      }));
    }

  }



  const fetchData = async () => {
    try {
      const datos = await getProduccionView();

      const filteredData = datos.filter((item) => item.Estado !== "concluido");
      setData(filteredData);
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  const handleModal = async () => {
    console.log("Selectexd", selectData)
     if( selectData.orden === "" || selectData.orden === "0" ){
      console.log("xd orden xd xd ")
      toast.error(
        `¡Primero debes Seleccionar una Orden!`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      // console.log("Seleccione una orden.");
      return;
    }else if(paquetes.paqueteA === "" || paquetes.paqueteA === null ){
console.log("no hay paquetes ")
      toast.error(
        `Seleccione los paquetes para continuar.`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }


const llaveMaestra = localStorage.getItem("llave");
const xdllave = parseInt(llaveMaestra);
    console.log("llego a la funcion")
  //  setIsOpen(true)
  //  onSelectOrden("Orden123")
const objectToSend = {
  Estado: 2,
  caballete1: paquetes.paqueteA,
  caballete2: paquetes.paqueteB,
  caballete3:"0",
  caballete4:"0",
  cantidad_total: selectData.cantidad_total,
  cod: selectData.cod,
  estado_calandra: 0,
  orden: selectData.orden,
  llave:xdllave,
}

 try {
    setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const valuesxd = (objectToSend);
      const response = await updateLavadora(dataParse.orden, valuesxd);
      setToggle(true);
            // Si paquete1 es inválido, usa paquete2
            if (!paquetes.paqueteA?.trim() && paquetes.paqueteB?.trim()) {
              paquetes.paqueteA = paquetes.paqueteB;
              } else if (!paquetes.paqueteB?.trim() && paquetes.paqueteA?.trim()) {
              paquetes.paqueteB = paquetes.paqueteA;
              }
              
              localStorage.setItem("paquete1", paquetes.paqueteA ?? "");
              localStorage.setItem("paquete2", paquetes.paqueteB ?? "");
       localStorage.setItem("toggle", true);
       localStorage.setItem("cod", selectData.cod);
       localStorage.setItem("cantidad_total", selectData.cantidad_total);


      localStorage.setItem("Estado", selectData.Estado);
      setRegistrationSuccess(true); // O cualquier otra acción que debas tomar
      setButtonEnable(false);
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error("error sending data", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }


  }

  
  const handlePause = async () => {

    const palanca = JSON.parse(localStorage.getItem("toggle") || "false"); 
    // console.log("🚀 ~ handlePause ~ palanca:", palanca);
    
    if (palanca === true) {
        // console.log("La palanca está activada");
    
      toast.error(
        `¡Primero debes Seleccionar una Orden!`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      // console.log("Seleccione una orden.");
      return;
    }else{

    handleUpdate();
    handleButtom();
    setButtonEnable(true);
    setParse({});

    setData([]); // Limpia los datos para no renderizar nada
    fetchDataList();

    // Establecer la orden como "0" en localStorage y en el estado
    localStorage.setItem("Estado", "0");
    localStorage.setItem("estado_calandra", "0");
    localStorage.setItem("orden", "0");
    localStorage.setItem("pvb", "");
    localStorage.setItem("paquete1", "");
    localStorage.setItem("paquete2", "");
    localStorage.setItem("selectedCaballetes", "");
    setSelectedCaballetes([]);
    setPaquetes({ paqueteA: null, paqueteB: null });
    setSelectData((prevState) => ({ ...prevState, orden: "0" }));
  
    // Evitar renderizado adicional estableciendo estados pertinentes
  // setToggle(false);
}
  };
  
  
// console.log("palanca", toggle)
// const handleUpdate = async () => {
//     // setIsLoading(true);

//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//    const valuesxd = ({...selectData, estado_calandra:0});
//   //  const ordenGuardada = localStorage.getItem("orden");
//   //  const EstadoGuardada = localStorage.getItem("Estado");
//   //  const EstadoCalandra = localStorage.getItem("estado_calandra");
  
//   //  const valuesdx = {
//   //   EstadoCalandra,
//   //   EstadoGuardada
//   //  }
//   //  if (ordenGuardada) {
//   //   const response = await updateLavadora(ordenGuardada, valuesdx);
//   //   }else{
//   //   const response = await updateLavadora(dataParse.orden, valuesxd);

//   //   }
//     const response = await updateLavadora(dataParse.orden, valuesxd);
//     localStorage.setItem("paquete1", paquetes.paqueteA);
//     localStorage.setItem("paquete2", paquetes.paqueteB);


//     // setButtonEnable(true);
//     // console.log(response);
//     fetchDataList();
//     setSelectData({
//       id: "",
//       orden: "",
//       cod: "",
//       cantidad_total: "0",
//       producidos: "0",
//       Estado: "Seleccione una Orden",
//       lote: "Seleccione una Orden",
//       descripcion: "Seleccione una Orden",
//       pvb: "Seleccione una Orden",
//       create_at: "Seleccione una Orden",
//     })
//     // setRegistrationSuccess(true);
//   } catch (error) {
    
//   }
// }



const handleUpdate = async () => {

  try {
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const valuesxd = { ...selectData, estado_calandra: 0, pvb: 0 };
    const response = await updateLavadora(dataParse.orden, valuesxd);

    fetchDataList();

    setSelectData({
      id: "",
      orden: "",
      cod: "",
      cantidad_total: "0",
      producidos: "0",
      Estado: "Seleccione una Orden",
      lote: "Seleccione una Orden",
      descripcion: "Seleccione una Orden",
      pvb: "Seleccione una Orden",
      create_at: "Seleccione una Orden",
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
  }
  setToggle(true);
};

// useEffect(() => {
//   if (toggle) {
//  setToggle(true);
//   }
// }, [handleUpdate]);

useEffect(() => {
  const handleStorageChange = () => {
    setPaquetes({
      paqueteA: localStorage.getItem("paquete1"),
      paqueteB: localStorage.getItem("paquete2"),
    });
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

   const handleButtom =  () => {
    setButtonStop(true);
   }

   useEffect(() => {
    if(buttonEnable === false){
      setButtonStop(true);
    
    } else if (buttonEnable === true){
      setButtonStop(false);
    }
 
   }, [buttonEnable])
   

  //  useEffect(() => {
  //  setSelectData()
  //  }, [buttonEnable])
   
  useEffect(() => {
    const ordenGuardada = localStorage.getItem("orden");
    if (ordenGuardada === "0") {
      fetchDataList();
    }
  }, []);

   const fetchDataList = async () => {
    try {
      const datos = await getProduccionView();

      if (datos) {
        const filteredData = datos.filter((item) => item.Estado !== "concluido");
        setData(filteredData);
        //  setButtonEnable(false);
        // setButtonStop(false);
      }
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }
  };


  const HandleCargadoraPaquete = async (cab) => {
    try {
      const response = await getOneDatosCargadoraCab(cab);
      return response?.cod_interno || null;
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
      return null;
    }
  };


  const veririfyPaquete = async (paquete) => {
    const response = await getOne(paquete);
    if(response.cantidad_entrada==0){
      toast.error(
        `Paquete ${response.cod_interno} tiene ${response.cantidad_entrada} chapas, Registrar nuevo Paquete.`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      try {
        const data = { status_active: 0, id_caballete: 1 };
        const update = await putDescuentoStock(response.id, data);
        console.log("update", update);
      } catch (error) {
        console.error("Error al actualizar el stock:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getPaquete();

     
    }
  }

 console.log("datos seleccionados",selectData)



const handleUpdatePaquete = async () => {
  // console.log("Estado actual de selectData:", selectData);

  // Verificar si los valores necesarios están presentes
  if (!selectData.cantidad_total || !selectData.cod) {
    console.error("Faltan valores en selectData:", selectData);
    toast.error("No se pueden enviar paquetes. Verifica los datos seleccionados.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return;
  }

  const paq1 = localStorage.getItem("paquete1");
  const paq2 = localStorage.getItem("paquete2");
  const orden = localStorage.getItem("orden");
  const ordeni = parseInt(orden);
  const codd = localStorage.getItem("cod");
  const cantidad_total = localStorage.getItem("cantidad_total");

  const objectToSend = {
    Estado: 2,
    caballete1: paq1,
    caballete2: paq2,
    caballete3: "0",
    caballete4: "0",
    cantidad_total: cantidad_total,
    cod: codd,
    estado_calandra: 0,
    orden: ordeni,
    pvb:0
  };

  console.log("🚀 ~ handleUpdatePaquete ~ objectToSend:", objectToSend);

  try {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await updateLavadora(dataParse.orden, objectToSend);
    console.log("Respuesta del servidor:", response);

    setToggle(true);

    // Actualizar localStorage con los paquetes
    if (!paquetes.paqueteA?.trim()) paquetes.paqueteA = paquetes.paqueteB;
    if (!paquetes.paqueteB?.trim()) paquetes.paqueteB = paquetes.paqueteA;

    localStorage.setItem("paquete1", paquetes.paqueteA);
    localStorage.setItem("paquete2", paquetes.paqueteB);
    localStorage.setItem("toggle", true);
    localStorage.setItem("Estado", selectData.Estado);

    setRegistrationSuccess(true);
    setButtonEnable(false);

    setTimeout(() => {
      handleCloseModal();
    }, 1000);
  } catch (error) {
    console.error("Error al enviar paquetes:", error);
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }
};

const getPaquete = async () => {
  const selectedCaballetes = JSON.parse(localStorage.getItem("selectedCaballetes") || "[]");

  const caballete1 = selectedCaballetes[0];
  const caballete2 = selectedCaballetes[1];

  const resp = await HandleCargadoraPaquete(caballete1);
  const resp2 = await HandleCargadoraPaquete(caballete2);

  localStorage.setItem("paquete1", resp);
  localStorage.setItem("paquete2", resp2);

  setPaquetes({
    paqueteA: resp,
    paqueteB: resp2,
  });

  // Llamar a handleUpdatePaquete después de actualizar los paquetes
  handleUpdatePaquete();

  console.log("Paquetes actualizados:", resp, resp2);
}
  
  const handleCloseModal = () => {
    setIsOpen(false);
    // resetForm();
  };


  const getRowClassName = (params) => {
    const estado = params.row.Estado;
    switch (estado) {
      case "programado":
        return "estado-pendiente";
      case "concluido":
        return "estado-completo";
      case "en proceso":
        return "estado-en-proceso";
      default:
        return "estado-default";
    }
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordenGuardada = localStorage.getItem("orden") ;
        if (ordenGuardada != "0") {
          const datos = await getOneOrdenProduccionxd(ordenGuardada);
          if (datos) {
            setData([datos]);
          }
           setButtonStop(true);
           setButtonEnable(false);


        }else if (ordenGuardada === null || ordenGuardada === undefined) {
          // console.log("xd")
        } 
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    if (dataParse.orden === null || dataParse.orden === undefined) {
      // console.log("xd")
    }else{
      fetchData(); 
    }
  
  }, []);

  useEffect(() => {
    const storedCaballetes = localStorage.getItem("selectedCaballetes");
    if (storedCaballetes) {
      setSelectedCaballetes(JSON.parse(storedCaballetes));
      // console.log("storedCaballetes", storedCaballetes);
    }
  }, []);
  
  // console.log("selectxd", selectedCaballetes);

  const handleSelectCaballetes = async (cab) => {
    setSelectedCaballetes((prev) => {
      let updatedCaballetes = [...prev];
  
      // Si el caballete ya está seleccionado, lo eliminamos
      if (updatedCaballetes.includes(cab)) {
        updatedCaballetes = updatedCaballetes.filter((c) => c !== cab);
  
        // Reiniciar paquetes a null cuando se deselecciona cualquier caballete
        setPaquetes({ paqueteA: null, paqueteB: null });
  
        // Desactivar botones cuando los paquetes se vuelvan null
        setBotonesDeshabilitados(true);
  
        // Si no hay caballetes seleccionados, limpiar el localStorage
        if (updatedCaballetes) {
          localStorage.removeItem("selectedCaballetes");
        } else {
          localStorage.setItem("selectedCaballetes", JSON.stringify(updatedCaballetes));
        }
  
        return updatedCaballetes;
      }
  
      // Si ya hay 2 caballetes seleccionados, no permitir más
      if (updatedCaballetes.length >= 2) {
        console.log("No puedes seleccionar más de 2 caballetes. Primero deselecciona uno.");
        return prev;
      }
  
      // Agregar el nuevo caballete
      updatedCaballetes.push(cab);
  
      // Guardar en localStorage
      localStorage.setItem("selectedCaballetes", JSON.stringify(updatedCaballetes));
  
      // Obtener paquete del backend y actualizar correctamente
      HandleCargadoraPaquete(cab).then((paquete) => {
        setPaquetes((prevPaquetes) => {
          const nuevoPaqueteA = prevPaquetes.paqueteA === null ? paquete : prevPaquetes.paqueteA;
          const nuevoPaqueteB = prevPaquetes.paqueteA !== null && prevPaquetes.paqueteB === null ? paquete : prevPaquetes.paqueteB;
  
          // Activar botones solo si hay al menos un paquete seleccionado
          setBotonesDeshabilitados(nuevoPaqueteA === null && nuevoPaqueteB === null);
  
          return { paqueteA: nuevoPaqueteA, paqueteB: nuevoPaqueteB };
        });
      });
  
      return updatedCaballetes;
    });
  };



  
  // const handleSelectCaballetes = async (cab) => {
  //   setSelectedCaballetes((prev) => {
  //     let updatedCaballetes = [...prev];
  
  //     // Si el caballete ya está seleccionado, lo eliminamos
  //     if (updatedCaballetes.includes(cab)) {
  //       updatedCaballetes = updatedCaballetes.filter((c) => c !== cab);
  
  //       // Reiniciar paquetes a null cuando se deselecciona cualquier caballete
  //       setPaquetes({ paqueteA: null, paqueteB: null });
  
  //       // Desactivar botones cuando los paquetes se vuelvan null
  //       setBotonesDeshabilitados(true);
  
  //       return updatedCaballetes;
  //     }
  
  //     // Si ya hay 2 caballetes seleccionados, no permitir más
  //     if (updatedCaballetes.length >= 2) {
  //       console.log("No puedes seleccionar más de 2 caballetes. Primero deselecciona uno.");
  //       return prev;
  //     }
  
  //     // Agregar el nuevo caballete
  //     updatedCaballetes.push(cab);
  
  //     // Obtener paquete del backend y actualizar correctamente
  //     HandleCargadoraPaquete(cab).then((paquete) => {
  //       setPaquetes((prevPaquetes) => {
  //         const nuevoPaqueteA = prevPaquetes.paqueteA === null ? paquete : prevPaquetes.paqueteA;
  //         const nuevoPaqueteB = prevPaquetes.paqueteA !== null && prevPaquetes.paqueteB === null ? paquete : prevPaquetes.paqueteB;
  
  //         // Activar botones solo si hay al menos un paquete seleccionado
  //         setBotonesDeshabilitados(nuevoPaqueteA === null && nuevoPaqueteB === null);
  
  //         return { paqueteA: nuevoPaqueteA, paqueteB: nuevoPaqueteB };
  //       });
  //     });
  
  //     return updatedCaballetes;
  //   });
  // };
  
  // console.log(paqueteA, paqueteB)

// Obtener paquete asociado a un caballete


  return (
    // container
    <Box
      sx={{
        background: "#111830",
        height: "96vh",
        width: "98%",
        padding: "3vh 5vw",
        marginTop: "2vh",
        marginLeft: "1vw",
        // boxShadow: "0 0 5px 0px #000000",
        borderRadius: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* container flex */}
      <Box
        sx={{
          display: "flex",
          height: "102%",
          width: "109%",
          marginLeft: "-4vw",
        }}
      >
        <Box
          sx={{
            background: "#242b43",
            // background:"#111830",
            width: "99%",
            height: "92vh",
            marginRight: "0.9vw",
          }}
        >
          <Box
            sx={{
              height: "10vh",
              width: "47vw",
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "1.5%",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "2.2vw",
                  marginLeft: "1vh",
                  marginTop: "2vh",

                  fontWeight: "600",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {/* Camión: {filteredData.chapa} */}
                Orden de Produccion N°:
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: "2.2vw",
                  marginLeft: "1vh",
                  marginTop: "2vh",
                  fontWeight: "600",
                  color: "rgb(206, 220, 0)",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {selectData.orden}
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: "2.2vw",
                marginRight: "2.5vh",
                fontWeight: "600",
                textShadow: "2px 2px 2px black",
                marginTop: "2vh",
              }}
            >
              {/* Camión: {filteredData.chapa} */}
              Cargadora
            </Typography>
          </Box>

          <Box
            sx={{
              height: "30vh",
              width: "45vw",
              background: "#2a324d",
              margin: "auto",
              marginTop: "3vh",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5vw",
                marginLeft: "1vh",
                paddingTop: "2vh",

                fontWeight: "600",
                textShadow: "2px 2px 2px black",
              }}
            >
              {selectData.cod}
            </Typography>

            <Box sx={{ display: "flex" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  fontWeight: "600",
                  textShadow: "2px 2px 2px black",
                  paddingTop: "2vh",
                }}
              >
                {/* Camión: {filteredData.chapa} */}
                LOTE:
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  paddingTop: "2vh",
                  fontWeight: "600",
                  color: "rgb(206, 220, 0)",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {selectData.lote }
              </Typography>
            </Box>

            <Box sx={{ display: "flex" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  paddingTop: "2vh",
                  fontWeight: "600",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {/* Camión: {filteredData.chapa} */}
                CHAPA:
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  paddingTop: "2vh",
                  fontWeight: "600",
                  color: "rgb(206, 220, 0)",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {/* Camión: {filteredData.chapa} */}
                {selectData.producidos}
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  paddingTop: "2vh",
                  fontWeight: "600",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {/* Camión: {filteredData.chapa} */}/
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  paddingTop: "2vh",
                  fontWeight: "600",
                  color: "rgb(206, 220, 0)",
                  textShadow: "2px 2px 2px black",
                }}
              >
                {/* Camión: {filteredData.chapa} */}
                {selectData.cantidad_total}
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5vw",
                marginLeft: "1vh",
                paddingTop: "2vh",

                fontWeight: "600",
                textShadow: "2px 2px 2px black",
              }}
            >
              {selectData.descripcion}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5vw",
                marginLeft: "1vh",
                paddingTop: "2vh",
                fontWeight: "600",
                textShadow: "2px 2px 2px black",
              }}
            >
              {selectData.pvb}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "10%",
              // background:"red"
              paddingLeft: "2vw",
              margin: "1.5vh",
              paddingTop: "1vh",
            }}
          >
            <Button
              onClick={handleModal}
              disabled={!buttonEnable}
              sx={{
                backgroundColor: buttonEnable ? "rgb(206, 220, 0)" : "gray",
                border: "none",
                color: buttonEnable ? "black" : "white",
                height: "6vh",
                width: "20vw",
                borderRadius: "20px",
                cursor: buttonEnable ? "pointer" : "not-allowed",
                marginRight: "2vw",

                "&:hover": {
                  backgroundColor: buttonEnable ? "#bac609" : "gray",
                },
              }}
            >
              {" "}
              Iniciar{" "}
            </Button>{" "}
            <Button
              disabled={!buttonStop}
              onClick={handlePause}
              sx={{
                background: buttonStop ? "#740017" : "#49232a",
                border: "none",
                color: "white",
                height: "6vh",
                width: "20vw",
                borderRadius: "20px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#a00423" },
              }}
            >
              {" "}
              Detener{" "}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "-2vh",
              marginBottom: "3vh",
            }}
          >
            <Box
              sx={{
                width: "100%",
                mr: 2,
                paddingLeft: "1vw",
                paddingTop: "1vw",
              }}
            >
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: "25px", // Altura de la barra
                  borderRadius: "5px",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "rgb(206, 220, 0)",
                  },
                }}
              />
            </Box>

            <Box sx={{ minWidth: 50 }}>
              <Typography
                variant="body1"
                sx={{ color: "white", fontWeight: "bold", paddingTop: "1vw" }}
              >
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>

          {/* xd */}

          <Box
            sx={{
              height: "20vh",
              width: "45vw",
              background: "#2a324d",
              margin: "auto",
              marginTop: "1vh",
              display: "flex",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                justifyContent: "center",
                height: "30.5vh",
                width: "45vw",
                background: "#2a324d",

                marginTop: "0vh",
              }}
            >
              <Box>
                <Button
                  type="submit"
                  onClick={() => handleSelectCaballetes(caballetesA.car1A)}
                  sx={{
                    border: "none",
                    color: "white",
                    height: "7vh",
                    width: "10vw",
                    borderRadius: "20px",
                    cursor: "pointer", // Deshabilita cursor si no hay paquetes
                    marginLeft: "0vw",
                    // backgroundColor: botonesDeshabilitados ? "gray" : "rgb(206, 220, 0)", // Color apagado si está deshabilitado
                    // "&:hover": !botonesDeshabilitados ? { backgroundColor: "#bac609" } : {}, // Solo permitir hover si está habilitado
                  }}
                  // disabled={botonesDeshabilitados} // Deshabilita el botón si es necesario
                  endIcon={
                    <VerticalShadesClosedIcon
                      sx={{
                        fontSize: "8vh!important",
                        border:
                          selectedCaballetes.includes(caballetesA.car1A)
                            ? "2px solid #bac609"
                            : "none",
                      }}
                    />
                  }
                >
                  CAB1A
                </Button>
              </Box>

              <Box>
                <Button
                  type="submit"
                  onClick={() => handleSelectCaballetes(caballetesA.car2A)}
                  sx={{
                    // backgroundColor: "rgb(206, 220, 0)",
                    border: "none",
                    color: "white",
                    height: "7vh",
                    width: "10vw",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "2vw",

                    // "&:hover": { backgroundColor: "#bac609" },
                  }}
                  endIcon={
                    <VerticalShadesClosedIcon
                      sx={{
                        fontSize: "8vh!important",
                        border:
                          
                          selectedCaballetes.includes(caballetesA.car2A)
                            ? "2px solid #bac609"
                            : "none",
                      }}
                    />
                  }
                >
                  CAB2A
                </Button>
              </Box>

              <Box>
                <Button
                  type="submit"
                  onClick={() => handleSelectCaballetes(caballetesA.car3A)}
                  sx={{
                    // backgroundColor: "rgb(206, 220, 0)",
                    border: "none",
                    color: "white",
                    height: "7vh",
                    width: "10vw",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "2vw",

                    // "&:hover": { backgroundColor: "#bac609" },
                  }}
                  endIcon={
                    <VerticalShadesClosedIcon
                      sx={{
                        fontSize: "8vh!important",
                        border:
                         
                          selectedCaballetes.includes(caballetesA.car3A)
                            ? "2px solid #bac609"
                            : "none",
                      }}
                    />
                  }
                >
                  CAB3A
                </Button>
              </Box>
            </Box>

            {/* cargadora */}
            <Box
              sx={{
                height: "29.5vh",
                width: "45vw",
                background: "#2a324d",
                // margin: "auto",
                marginTop: "1vh",
                // display: "flex",
              }}
            >
              <img
                src="../../assets/cargadora.png"
                style={{
                  width: "60%",
                  height: "110%",
                  marginTop: "-3vh",
                  marginLeft: "2.8vw",
                }}
              ></img>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "center",
                height: "30.5vh",
                width: "45vw",
                background: "#2a324d",

                marginTop: "0vh",
              }}
            >
              <Box>
                <Button
                  type="submit"
                  onClick={() => handleSelectCaballetes(caballetesB.car1B)}
                  sx={{
                    // backgroundColor: "rgb(206, 220, 0)",
                    border: "none",
                    color: "white",
                    height: "7vh",
                    width: "10vw",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "0vw",

                    // "&:hover": { backgroundColor: "#bac609" },
                  }}
                  startIcon={
                    <VerticalShadesClosedIcon
                      sx={{
                        marginLeft: "-3vw",
                        fontSize: "8vh!important", // Ajusta el tamaño del ícono aquí
                        border:
                         
                          selectedCaballetes.includes(caballetesB.car1B)
                            ? "2px solid #bac609"
                            : "none",
                      }}
                    />
                  }
                >
                  CAB1B
                </Button>
              </Box>

              <Box>
                <Button
                  type="submit"
                  onClick={() => handleSelectCaballetes(caballetesB.car2B)}
                  sx={{
                    // backgroundColor: "rgb(206, 220, 0)",
                    border: "none",
                    color: "white",
                    height: "7vh",
                    width: "10vw",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "2vw",

                    // "&:hover": { backgroundColor: "#bac609" },
                  }}
                  startIcon={
                    <VerticalShadesClosedIcon
                    sx={{
                      marginLeft: "-3vw",
                      fontSize: "8vh!important", // Ajusta el tamaño del ícono aquí
                      border:
                       
                        selectedCaballetes.includes(caballetesB.car2B)
                          ? "2px solid #bac609"
                          : "none",
                    }}
                    />
                  }
                >
                  CAB2B
                </Button>
              </Box>

              <Box>
                <Button
                  type="submit"
                  onClick={() => handleSelectCaballetes(caballetesB.car3B)}
                  sx={{
                    // backgroundColor: "rgb(206, 220, 0)",
                    border: "none",
                    color: "white",
                    height: "7vh",
                    width: "10vw",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "2vw",

                    // "&:hover": { backgroundColor: "#bac609" },
                  }}
                  startIcon={
                    <VerticalShadesClosedIcon
                    sx={{
                      marginLeft: "-3vw",
                      fontSize: "8vh!important", // Ajusta el tamaño del ícono aquí
                      border:
                       
                        selectedCaballetes.includes(caballetesB.car3B)
                          ? "2px solid #bac609"
                          : "none",
                    }}
                    />
                  }
                >
                  CAB3B
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* container 2 */}
        <Box
          sx={{
            background: "#111830",
            width: "100%",
            height: "99%",
            // display:"flex"
            borderTop: "3px solid #242b43",
            position: "relative", // Establece un contexto de posición para el z-index
            zIndex: 10, // Define un nivel base
          }}
        >
          <Box
            m="10px 0 0 0"
            height="45.5vh"
            sx={{
              "& .MuiDataGrid-root": {
                position: "relative",
                border: "none",
                zIndex: 100,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[900],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[900],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
              // Estilos para las filas con hover
              "& .estado-pendiente": {
                backgroundColor: "#740017", // Color de texto
                textShadow: "2px 2px 2px 2px #ffffff",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
                },
              },
              "& .estado-completo": {
                backgroundColor: "green",
                textShadow: "2px 2px 2px 2px #ffffff",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
                },
              },
              "& .estado-en-proceso": {
                backgroundColor: "#ff6105",
                textShadow: "2px 2px 2px 2px #ffffff",
                color: "white !important",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
                },
              },
              "& .estado-default": {
                color: "gray",
                textShadow: "2px 2px 2px 2px #ffffff",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
                },
              },
            }}
          >
            <DataGrid
              rows={data}
              getRowId={(row) => `${row.id}`}
              columns={columns}
              getRowClassName={getRowClassName} // Aplicar la clase condicional
              disableMultipleSelection
              onRowDoubleClick={handleRowDoubleClick}
            />
          </Box>

          <Box
            sx={{
              background: "rgb(36 43 67)",
              width: "100%",
              height: "48vh",
              marginTop: "-2.5vh",
              overflow: "auto",
              position: "relative", // Contexto para mantener separación
              zIndex: 1, // Más bajo que el DataGrid
            }}
          >
            <Box height="200px" m="1px 0 0 0" sx={{ paddingTop: "1vh" }}>
              {/* <LineChart isDashboard={true} /> */}
              <ReporteLavadora />
            </Box>
          </Box>
        </Box>
      </Box>
      <ModalLavadoraStar
        open={isOpen}
        modalParse={dataParse}
        onClose={handleCloseModal}
        buttonEnabled={handleButtonStatus}
        order={handleOrderChange}
      />
      <ModalCharge isLoading={isLoading} />
       <ModalSuccess open={registrationSuccess} onClose={handleCloseModalS} />
      <ModalError
       open={registrationError}
       onClose={handleCloseModalError}
       error={error}
              />
      
    </Box>
  );
};

export default Lavadora;
