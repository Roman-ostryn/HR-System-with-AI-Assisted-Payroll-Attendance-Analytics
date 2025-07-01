
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// import { requestListTruckView } from "../../services/trukSocket.services";
import { Box, Typography, useTheme, InputBase, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import ModalMotivosCalandra from "../../modal/motivosCalandra/modalMotivosCalandra";
import { getOneDatosTicket, PostCalandra, getOneProducto } from "../../services/calandra.services";
// import { getProduccionView } from "../../services/lavadoraSocket.services";
import { getOrdenOne, getTemperatura, getSerie } from "../../services/ordenProduccion.services";
// import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import ReporteCalandra from "../../registration/reporteCalandra";
import ModalReImpresion from '../../modal/reImpresion/modalReImpresion';
import ModalClasificacion from "../../modal/clasificacion/modalClasificacion";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import SendIcon from '@mui/icons-material/Send';
import ModalCharge from "../../modal/modalCharge";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { updateLavadora } from "../../services/lavadoraSocket.services"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { constructNow } from "date-fns";
import dayjs from "dayjs";
import { getOneDatos } from "../../services/pvb.services";
import { getOne, putDescuentoStock} from "../../services/stock.services";
import getUrlSocket from '../../utils/getUrlSocket';
import { getOneDatosCargadoraCab } from "../../services/cargadora.services";

const SOCKET_URL = getUrlSocket();
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  query: {
    token: localStorage.getItem("authToken"),
  },
});


const CalandraTrue = (props) => {
  const [data, setData] = useState([]);
  const [xd, setxd] = useState([]);
  // const [cab, setCab] = useState([]);
  const [PVB, setPvb] = useState(() => {
    // Recuperar la orden del localStorage al cargar la página
    return localStorage.getItem("pvb") || "";
  });;
  const [chapa1, setChapa1] = useState("");
  const [chapa2, setChapa2] = useState("");
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [xdd, setxdd] = useState("");
  const [serieValue, setSerieValue] = useState(""); // Estado para la serie
  const [modalOpenClasifi, setModalOpenClasifi] = useState(false);
  const [productData, setProductData] = useState("");
  const [modalOpenCaballete, setModalOpenCaballete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenMotivo, setModalOpenMotivo] = useState(false);
  const [temperatura, setTemperatura] = useState([]);
  const [modalOpenReImpresion, setModalOpenReImpresion] = useState(false);
  const [chapas, setChapas] = useState(20); // Valor actual de chapas
  const [chapasT, setChapasT] = useState(100); // Valor total de chapas
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const Turno = localStorage.getItem('turno');
  const USER = parseInt(localStorage.getItem('id'));



  const [selectData, setSelectData] = useState({
    id: "",
    orden: "",
    cod: "",
    cantidad_total: "0",
    producidos: "0",
    Estado: "",
    descripcion: "",
    pvb: "",
    create_at: "",
    clasificacion: "",
    defecto: "",
    temperatura: "",
    id_caballete: "",
    id_clasificacion: "",
    motivo: "",
    obs: " ",
  });

  useEffect(() => {
    const fetchSerieData = async () => {
      socket.on("ProduccionUpdated", async (data) => {
        console.log("Datos recibidos desde el Socket:", data.response);
  
        if (data.response && data.response.orden) {
          const orden = data.response?.orden;
          const pvb = localStorage.getItem("pvb");
  
          try {
            const reponse = await getSerie(orden);
            localStorage.setItem("paquete1", reponse[0]?.caballete1 || "");
            localStorage.setItem("paquete2", reponse[0]?.caballete2 || "");
            localStorage.setItem("orden", reponse[0]?.orden || "");
            localStorage.setItem("estado_calandra", reponse[0]?.estado_calandra || "");
            localStorage.setItem("orden", reponse[0]?.orden || "");
            
            const paquete1 = localStorage.getItem("paquete1");
            const paquete2 = localStorage.getItem("paquete2");
            // const orden = localStorage.getItem("orden");
  
            if (orden != null) {
              setSl(orden);
              setEstadoCalandra(data.response.estado_calandra);
              setEstado(data.response.estado);
            }
            setPvb(data.response.id_pvb);
            fetchData(data.response);
            fetchSerie(orden);
  
            if (pvb) {
              veririfyPvb(pvb);
            }
  
            if (paquete1) {
              veririfyPaquete1(paquete1);
            }
  
            if (paquete2) {
              veririfyPaquete2(paquete2);
            }
          } catch (error) {
            console.error("Error obteniendo la serie:", error);
          }
        } else {
          console.warn("No se recibió una orden válida desde el socket.");
        }
      });
    };
  
    fetchSerieData();
  
    return () => {
      socket.off("ProduccionUpdated");
    };
  }, []);
  

  const [sl, setSl] = useState(() => {
    // Recuperar la orden del localStorage al cargar la página
    return localStorage.getItem("orden") || "";
  });
  const [EstadoCalandre, setEstadoCalandra] = useState(() => {
    // Recuperar la orden del localStorage al cargar la página
    return localStorage.getItem("estado_calandra") || "";
  });
  const [Estado, setEstado] = useState(() => {
    // Recuperar la orden del localStorage al cargar la página
    return localStorage.getItem("Estado") || "";
  });
  const paquete1 = localStorage.getItem("paquete1");
    let paquete2 = localStorage.getItem("paquete2");

    // Si paquete2 está vacío, asignar el valor de paquete1
    if (!paquete2) {
        paquete2 = paquete1;
        localStorage.setItem("paquete2", paquete2);
    }


  useEffect(() => {
    if (sl && sl !== "" && sl !== null && sl !== undefined && sl>0) {
      console.log("Recuperando datos desde localStorage:", sl);
      
      const orden = {
        orden: sl,
        estado_calandra: EstadoCalandre,
        estado: Estado,
      };
  
      fetchData(orden);
      fetchSerie(sl);
    }
  }, [sl]);
  

    const fetchSerie = async (orden) => {
      if (orden) {
        try {
          const data = await getSerie(orden);
          // console.log("🚀 ~ fetchSerie ~ data:", data)
          setPvb(data[0].pvb)
          const data1 = await getOneProducto(data[0]?.id_producto);
          setProductData(data1);
          // Verifica si data.serie es un arreglo y tiene elementos
          if (Array.isArray(data) && data.length > 0) {
            const serieValue = data[0]?.serie; // Obtiene el valor de serie
            setxdd(serieValue); // Asigna los datos obtenidos al estado
          } else {
            console.warn("No se encontró la serie en los datos recibidos.");
            setxdd("Sin datos disponibles"); // Valor predeterminado
          }
        } catch (error) {
          console.error("Error al obtener datos:", error.message);
          setxdd("Error al obtener datos"); // Manejo en caso de error
        }
      } else {
        console.warn("Orden no proporcionada.");
      }
    };

    // useEffect(() => {
    //   let timeoutId = null; // Variable para almacenar el timeout
    //   let waitingForNextUpdate = false; // Controla si debe ignorar los valores entrantes
    
    //   const handleTemperatura = (data) => {
    
    //     if (data.temperatura === "nan" || data.temperatura > 100) {
    //       // Si el valor es inválido, lo ignora y sigue esperando el siguiente
    //       return;
    //     }
    
    //     if (waitingForNextUpdate) {
    //       console.log("Esperando 30 segundos, ignorando valor:", data.temperatura);
    //       return; // Ignora el valor si está en la espera de 30 segundos
    //     }
    
    //     setTemperatura(data.temperatura);
    //     waitingForNextUpdate = true; // Activa el bloqueo de nuevas actualizaciones
    
    //     // Iniciar un timeout de 30 segundos antes de permitir nuevas actualizaciones
    //     timeoutId = setTimeout(() => {
    //       waitingForNextUpdate = false;
    //       console.log("Se pueden recibir nuevas temperaturas.");
    //     }, 30000);
    //   };
    
    //   // Escuchar eventos de temperatura actualizada
    //   socket.on("temperaturaActualizada", handleTemperatura);
    
    //   return () => {
    //     clearTimeout(timeoutId); // Limpiar el timeout al desmontar el componente
    //     socket.off("temperaturaActualizada", handleTemperatura);
    //   };
    // }, []); // No dependemos de `temperatura`, solo ejecutamos la lógica una vez al montar
    
    
    // const handleTemperatura = (event) => {
    //   setTemperatura(event.target.value);
    // };

    const HandleCargadoraPaquete = async (cab) => {
      try {
        const response = await getOneDatosCargadoraCab(cab);
        return response?.cod_interno || null;
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
        return null;
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
    
    
    
      // Llamar a handleUpdatePaquete después de actualizar los paquetes
      // handleUpdatePaquete();
    
      console.log("Paquetes actualizados:", resp, resp2);
    }

  const veririfyPvb = async (pvb) => {
    const response = await getOneDatos(pvb);
    if(response.largo<=3000){
      toast.error(
        `Registrar nuevo PVB en Sala Limpia`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  }

  
  const veririfyPaquete1 = async (paquete) => {
    const response = await getOne(paquete);
    setChapa1(response)
    if(response.cantidad_entrada<=0){
      localStorage.setItem("paquete1", "");
      toast.error(
        `Registrar nuevo Paquete en Cargadora`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      const data = { status_active: 0, id_caballete: 1 };
      const update = await putDescuentoStock(response.id, data);
      setData([]);
      setxd([]);
      getPaquete();
    }
  }


  
  const veririfyPaquete2 = async (paquete) => {
    const response = await getOne(paquete);
    setChapa2(response)
    if(response.cantidad_entrada<=0){
      localStorage.setItem("paquete2", "");
      toast.error(
        `Registrar nuevo Paquete en Cargadora`,
        {
          position: "top-center",
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      const data = { status_active: 0, id_caballete: 1  };
      const update = await putDescuentoStock(response.id, data);
      setData([]);
      setxd([]);

      getPaquete();
      // console.log("🚀 ~ veririfyPaquete1 ~ update:", update);
    }

  }

    const handleCloseModal = () => {
      setRegistrationSuccess(false);
    };

    const handleCloseModalError = () => {
      setRegistrationError(false);
    };


  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "orden",
      headerName: "Orden",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "cod",
      headerName: "Producto",
      flex: 1.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cantidad_total",
      headerName: "Total",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "producidos",
      headerName: "Producidos",
      flex: 0.5,
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


  const handleSerieChange = (e) => {
    setSerieValue(e.target.value);
  };


  // Calcular el progreso como porcentaje
  const progress = xd.cantidad_total ? (xd.producidos / xd.cantidad_total) * 100 : 0;

  useEffect(() => {
    // Simulación de actualización de valores para prueba
    const interval = setInterval(() => {
      setChapas((prev) => (prev < chapasT ? prev + 1 : chapasT));
    }, 1000);

    return () => clearInterval(interval);
  }, [chapasT]);



  const fetchData = async (orden) => {

    try {
      const datos = await getOrdenOne(orden.orden);
      // console.log("🚀 ~ fetchData ~ datos:", datos)
      const estado_calandra = parseInt(orden.estado_calandra);
      // const estado =  parseInt(orden.estado);
      if (estado_calandra === 1 && datos.Estado != "programado") {
        // if (estado_calandra === 1 && estado > 1) {
        setxd(datos);
        const rows = datos ? [datos] : [];
        setData(rows);
        if (datos.producidos == datos.cantidad_total){
          localStorage.setItem("Estado", "0");
          localStorage.setItem("estado_calandra", "0");
          localStorage.setItem("orden", "0");
        }
      } else {
        setxd("");
        setData([]);
      }
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }
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

  const handleKeyDown = (event) => {
    // Detecta si se presionó la tecla Tab
    if (event.key === 'Tab') {
      // Prevenir el comportamiento por defecto del tab (enfocar el siguiente input)
      event.preventDefault();
      // Abre el modal de reimpresión
      setModalOpenReImpresion(true);
    }
  };


  
  // const handleVerifySerie = async () => {
  //   const valuesToSend = {
  //     id_producto: productData.id,
  //     cod: xd.cod,
  //     descripcion: xd.descripcion,
  //     id_clasificacion: parseInt(selectData.id_clasificacion),
  //     id_categoria: productData.id_categoria,
  //     medidas: productData.medidas,
  //     cantidad: 1, // Ajusta esto según sea necesario
  //     temperatura: parseInt(selectData.temperatura),
  //     id_pvb: parseInt(PVB),
  //     id_horarios: parseInt(Turno),
  //     id_usuario: USER,
  //     serie: xdd,
  //     obs: selectData.defecto,
  //     motivo: " ",
  //     cantidad_entrada: paquete1,
  //     cantidad_utilizada: paquete2,
  //   };

  //   const edit = {
  //     orden: sl,
  //     Estado: 5,
  //     estado_calandra: 1,
  //     serie: xdd,
  //     pvb: parseInt(PVB),
  //     chapa1: paquete1,
  //     chapa2: paquete2,
  //   };

  //   setIsLoading(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // Validaciones antes de proceder
  //     if (xd.producidos == xd.cantidad_total) {
  //       toast.error(`La orden ha finalizado, inicia una nueva orden`, {
  //         position: "top-center",
  //         autoClose: 9000,
  //       });
  //       setIsLoading(false);
  //       return;
  //     } else if (
  //       !valuesToSend.cantidad_entrada ||
  //       !valuesToSend.cantidad_utilizada
  //     ) {
  //       toast.error(
  //         `Paquetes no encontrados. Bipear nuevo paquete en Cargadora`,
  //         { position: "top-center", autoClose: 9000 }
  //       );
  //       setIsLoading(false);
  //       return;
  //     } else if (!valuesToSend.id_pvb) {
  //       toast.error(`PVB no encontrado. Actualice o registre uno`, {
  //         position: "top-center",
  //         autoClose: 9000,
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     // 1️⃣ Insertar primero en la calandra
  //     let insertResponse;
  //     // let updateResponse;
  //     try {
  //       insertResponse = await PostCalandra(valuesToSend);

  //       const { id_produccion } = insertResponse.resp;
  //       getTicket(id_produccion);
  //     } catch (insertError) {
  //       console.error("❌ Error en PostCalandra:", insertError);
  //       toast.error(`Error en inserción: ${insertError.message}`, {
  //         position: "top-center",
  //       });
  //       setIsLoading(false);
  //       return; // Si falla la inserción, detener la ejecución
  //     }

  //     // 2️⃣ Si la inserción es exitosa, actualizar en lavadora
  //     let updateResponse;
  //     try {
  //       updateResponse = await updateLavadora(sl, edit);
  //       // console.log("✅ updateLavadora ejecutado correctamente", updateResponse);
  //     } catch (updateError) {
  //       console.error("❌ Error en updateLavadora:", updateError);
  //       toast.error(`Error en actualización: ${updateError.message}`);
  //       setIsLoading(false);
  //       return; // Si la actualización falla, detener la ejecución
  //     }

  //     setRegistrationSuccess(true);
  //     selectData.temperatura = "";
  //   } catch (error) {
  //     console.error("❌ Error general en handleVerifySerie:", error);
  //     setRegistrationError(true);
  //     setError(error.message);
  //   } finally {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000);
  //   }
  // };
  


  const handleVerifySerie = async () => {
  setIsLoading(true);

  const valuesToSend = {
    id_producto: productData.id,
    cod: xd.cod,
    descripcion: xd.descripcion,
    id_clasificacion: parseInt(selectData.id_clasificacion),
    id_categoria: productData.id_categoria,
    medidas: productData.medidas,
    cantidad: 1,
    temperatura: parseInt(selectData.temperatura),
    id_pvb: parseInt(PVB),
    id_horarios: parseInt(Turno),
    id_usuario: USER,
    serie: xdd,
    obs: selectData.defecto,
    motivo: " ",
    cantidad_entrada: paquete1,
    cantidad_utilizada: paquete2,
  };

  const edit = {
    orden: sl,
    Estado: 5,
    estado_calandra: 1,
    serie: xdd,
    pvb: parseInt(PVB),
    chapa1: paquete1,
    chapa2: paquete2,
  };

  const validarDatos = () => {
    if (xd.producidos === xd.cantidad_total) {
      toast.error(`La orden ha finalizado, inicia una nueva orden`, { position: "top-center", autoClose: 9000 });
      return false;
    }
    if (!valuesToSend.cantidad_entrada || !valuesToSend.cantidad_utilizada) {
      toast.error(`Paquetes no encontrados. Bipear nuevo paquete en Cargadora`, { position: "top-center", autoClose: 9000 });
      return false;
    }
    if (!valuesToSend.id_pvb) {
      toast.error(`PVB no encontrado. Actualice o registre uno`, { position: "top-center", autoClose: 9000 });
      return false;
    }
    return true;
  };

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!validarDatos()) return;

    const insertResponse = await PostCalandra(valuesToSend);
    const { id_produccion } = insertResponse.resp;
    getTicket(id_produccion);

    await updateLavadora(sl, edit);

    setRegistrationSuccess(true);
    selectData.temperatura = "";
  } catch (error) {
    console.error("❌ Error en handleVerifySerie:", error);
    toast.error(error.message || "Error general", { position: "top-center" });
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
};

  useEffect(() => {
    // Agregar evento de escucha para la tecla "Tab" en el formulario
    document.addEventListener('keydown', handleKeyDown);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const getTicket = async (id) => {
    const response = await getOneDatosTicket(id);
    if (response) {
      const { cod, codigo, descripcion, medidas, clasificacion, serie, id_produccion,obs, created_At } = response;
      const fecha = dayjs(created_At).format("DD/MM/YYYY HH:mm");

      const ticketData = {
        cod: cod,
        codigo: codigo,
        descripcion: descripcion,
        medidas: medidas,
        clasificacion: clasificacion,
        serie: serie,
        obs: obs,
        id_produccion: id_produccion,
        fecha: fecha
      };

      // Call function to print ticket
      generateZPL(ticketData);
    } else {
      console.error("No se encontró el ticket con el ID proporcionado");
    }
  };

const generateZPL = async (values) => {
// console.log("🚀 ~ generateZPL ~ values:", values)

  const formatText = (text, maxLength) => {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    for (let word of words) {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  const descripcionLines = formatText(values.codigo, 50);

  let zplx = `
  ^XA
  ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
  ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)

  `;
  descripcionLines.forEach((line, index) => {
    zplx += `^FO30,${25 + index * 30}^A0N,28,28^FD${line}^FS\n`;
  });
  zplx += `
  ^FO30,${25 + descripcionLines.length * 30 + 30}^A0N,28,28^FD^FS
  // Medidas
  ^FO200,110^A0N,35,35^FD${values.medidas}^FS

  // Clasificación

  // Código QR, más grande

  ^FO540,100^BQN,2,8^FDQA,${values.serie}^FS

  // ID Producción, fecha y serie
  ^FO20,320^A0N,35,35^FD${values.id_produccion}^FS
  ^FO190,320^A0N,35,35^FD${values.fecha}^FS
  ^FO550,320^A0N,35,35^FD${values.serie}^FS

  ^XZ
  `;

  if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
    window.BrowserPrint.getDefaultDevice("printer",
    (device) => {
        if (device) {
        setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
        let zplCommand = zplx;

        // 3. Usar la función send para enviar los datos al dispositivo
        device.send(zplCommand, function(response) {
            // console.log("Datos enviados exitosamente:", response);
        }, function(error) {
            console.error("Error al enviar datos:", error);
        });
        } else {
        setPrinterInfo("No hay una impresora predeterminada configurada.");
        }
    },
    (error) => {
        setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
    }
    );
  } else {
    setErrorMessage('BrowserPrint no está disponible.');
  }
  };



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
              {xd.orden}

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
              Calandra
            </Typography>
              </Box>
              <Box
                mb={2}
                width="100%"
                sx={{
                  borderRadius: "2%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
              {/* <InputBase
                sx={{
                  flex: 1,
                  backgroundColor: colors.primary[400],
                  padding: "20px 10px",
                  borderRadius: "4px",
                  backgroundColor: "#2a324d",
                  height: "30px",
                  marginLeft: "10px"
                }}
                placeholder="Ingrese Temperatura"
                value={temperatura}
                onChange={handleTemperatura}
              /> */}
              <InputBase
                sx={{
                  flex: 1,
                  backgroundColor: colors.primary[400],
                  padding: "20px 10px",
                  borderRadius: "4px",
                  backgroundColor: "#2a324d",
                  height: "30px",
                  marginLeft: "10px"
                }}
                placeholder="Ingrese Temperatura"
                value={selectData.temperatura}
                onChange={(e) => {
                  const { value } = e.target; // Obtén el valor ingresado
                  setSelectData((prev) => ({
                    ...prev,
                    temperatura: value || temperatura || "", // Actualiza la propiedad 'temperatura'
                  }));
                }}
              />
              <IconButton
                type="button"
                onClick={handleVerifySerie}
                sx={{
                  backgroundColor: colors.primary[400],
                  borderRadius: "4px",
                  p: 1,
                  "&:hover": {
                    backgroundColor: colors.primary[500],
                  },
                }}
              >
                <SendIcon/>
              </IconButton>
            </Box>
            
            
            <Box
            sx={{
              display: "flex",
              alignItems: "center", // Alinea verticalmente los elementos al centro
              gap: "10px", // Espaciado entre los elementos
              marginTop: "40px",
              // paddingTop: "10px"
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5vw",
                marginLeft: "1vh",
                fontWeight: "600",
                textShadow: "2px 2px 2px black",
              }}
            >
              CLASIFICACION
            </Typography>
            <InputBase
                sx={{
                  marginTop: "5px",
                  flex: 1,
                  backgroundColor: colors.primary[400],
                  padding: "20px 10px",
                  borderRadius: "4px",
                  backgroundColor: "#2a324d",
                  height: "30px",
                  width: "400px",
                  marginLeft: "10px",
                  marginRight: "20px",
                  // cursor: "pointer",
                }}
                placeholder="Ingrese Clasificacion"
                value={selectData.clasificacion}
                onChange={handleSerieChange}
                onClick={() => setModalOpenClasifi(true)}
              />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Alinea verticalmente los elementos al centro
              gap: "10px", // Espaciado entre los elementos
              marginTop: "40px",
              // paddingTop: "10px"
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5vw",
                marginLeft: "1vh",
                fontWeight: "600",
                textShadow: "2px 2px 2px black",
              }}
            >
              DEFECTO
            </Typography>
            <InputBase
              sx={{
                flex: 1,
                backgroundColor: "#2a324d",
                padding: "20px 10px",
                borderRadius: "4px",
                height: "30px",
                width: "400px",
                marginLeft: "93px",
                marginRight: "20px",
              }}
              placeholder="Ingrese Defecto"
              value={selectData.defecto}
              onChange={handleSerieChange}
              onClick={() => setModalOpenMotivo(true)}
            />
          </Box>
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center", // Alinea verticalmente los elementos al centro
              gap: "10px", // Espaciado entre los elementos
              marginTop: "40px",
              // paddingTop: "10px"
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5vw",
                marginLeft: "1vh",
                fontWeight: "600",
                textShadow: "2px 2px 2px black",
              }}
            >
              CABALLETE
            </Typography>
            <InputBase
                sx={{
                  marginTop: "5px",
                  flex: 1,
                  backgroundColor: colors.primary[400],
                  padding: "20px 10px",
                  borderRadius: "4px",
                  backgroundColor: "#2a324d",
                  height: "30px",
                  width: "400px",
                  marginLeft: "66px",
                  marginRight: "20px",
                }}
                placeholder="Ingrese Caballete"
                value={cab.id_caballete}
                onChange={handleSerieChange}
                onClick={() => setModalOpenCaballete(true)}
              />
          </Box>   */}
          <Box
            sx={{
              height: "35vh",
              width: "45vw",
              background: "#2a324d",
              margin: "auto",
              marginTop: "5vh",

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
              {xd.cod || ""}
            </Typography>

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
                {parseInt(xd.producidos) || 0}
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
                {parseInt(xd.cantidad_total) || 0}
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
              {xd.descripcion}

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
              {xd.pvb}

            </Typography>
          </Box>

          <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "2vh",
          }}
        >
          <Box sx={{ width: "100%", mr: 2, paddingLeft:"1vw",paddingTop:"1vw" }}>
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
            <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", paddingTop:"1vw"}}>
              {`${Math.round(progress)}%`}
            </Typography>
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
            />
          </Box>
          <ModalCharge isLoading={isLoading} />
          {registrationSuccess && (
            <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
          )}
          {registrationError && (
            <ModalError
              open={registrationError}
              onClose={handleCloseModalError}
              error={error}
            />
          )}

          <ModalReImpresion
            open={modalOpenReImpresion}
            onClose={() => setModalOpenReImpresion(false)}
            orden={xd}
          />

          <ModalClasificacion
            open={modalOpenClasifi}
            onClose={() => setModalOpenClasifi(false)}
            onSelect={(data) => {
            setSelectData((prev) => ({
                ...prev,
                clasificacion: data.descripcion, // Actualiza la propiedad 'clasificacion'
                id_clasificacion: data.id,
              }));
              setModalOpen(false);
            }}
          />

          {/* <ModalCaballete
            open={modalOpenCaballete}
            onClose={() => setModalOpenCaballete(false)}
            onSelect={(data) => {
            setCab((prev) => ({
                ...prev,
                id_caballete: data.id, // Actualiza la propiedad 'clasificacion'
              }));
              setModalOpen(false);
            }}
            serviceType={0}

          /> */}

          <ModalMotivosCalandra
            open={modalOpenMotivo}
            onClose={() => setModalOpenMotivo(false)}
            onSelect={(data) => {
              setSelectData((prev) => ({
                  ...prev,
                  defecto: data.descripcion, // Actualiza la propiedad 'clasificacion'
                }));
                setModalOpen(false);
              }}
          />
          <Box
            sx={{
              background: "rgb(36 43 67)",
              width: "100%",
              height: "48vh",
              marginTop:"-2.5vh",
              overflow: "auto",
              position: "relative", // Contexto para mantener separación
              zIndex: 1, // Más bajo que el DataGrid
            }}
          >
            <Box height="200px" m="1px 0 0 0" sx={{paddingTop:"1vh"}} >
              {/* <LineChart isDashboard={true} /> */}
              <ReporteCalandra />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CalandraTrue;
