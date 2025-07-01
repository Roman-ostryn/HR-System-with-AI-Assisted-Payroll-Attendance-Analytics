import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { requestListTruckView } from "../../services/trukSocket.services";
import { Box, Typography, useTheme } from "@mui/material";
import Line from "../../scenes/line/index";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
// import { getProduccionView } from "../../services/lavadoraSocket.services";
import { getOrdenOne, getSerie} from "../../services/ordenProduccion.services";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import ReporteSalaLimpia from "../../registration/reporteSalaLimpia";
import ModalVerificarPvb from '../../modal/salalimpia/modalVerificarPvb';
import ModalEdiPvb from '../../modal/pvb/modalEditPvb';
import { getOneDatos } from "../../services/pvb.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUrlSocket from "../../utils/getUrlSocket";

const SOCKET_URL = getUrlSocket();
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  query: {
    token: localStorage.getItem("authToken"),
  },
});

const SalaLimpia = (props) => {
  const [data, setData] = useState([]);
  const [xdxd, setxdxd] = useState([]);
  const [Estado_calandra, setEstadoCalandra] = useState(() => {
    return localStorage.getItem('estado_calandra') || "";
  });
  const [xd, setxd] = useState([]);
  const [modalOpenReImpresion, setModalOpenReImpresion] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [chapas, setChapas] = useState(20); // Valor actual de chapas
  const [chapasT, setChapasT] = useState(100); // Valor total de chapas
  const [filteredData, setFilteredData] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // useEffect(() => {
  //   socket.on('ProduccionUpdated', (data) => {
  //     fetchData(data.response);
  //     setSl(data.response.orden);
  //     localStorage.setItem("orden", data.response.orden);
  //   });
  //   return () => {
  //     socket.off('ProduccionUpdated');
  //   };
  // }, [socket]);

  useEffect(() => {
    socket.on("ProduccionUpdated", (data) => {
      console.log("Datos recibidos desde el Socket:", data.response);

      if (data.response && data.response.orden) {
        const orden = data.response.orden;
        const estado_calandra = data.response.estado_calandra
        const pvb = localStorage.getItem("pvb")
        // Guarda la orden en localStorage
        localStorage.setItem("orden", orden);
        localStorage.setItem("estado_calandra", estado_calandra)
        // Actualiza el estado y llama a fetchData
        // localStorage.setItem("paquete1", data.response.caballete1);
        // localStorage.setItem("paquete2", data.response.caballete2)
        fetchData(orden);
        setSl(orden);
        setEstadoCalandra(estado_calandra)
        if (pvb) {
          veririfyPvb(pvb);
        }else{
          // setModalOpenReImpresion(true)
        }
      } else {
        console.warn("No se recibió una orden válida desde el socket.");
      }
    });
    return () => {
      socket.off("ProduccionUpdated");
    };
  }, [socket]);

  const [sl, setSl] = useState(() => {
    // Recuperar la orden del localStorage al cargar la página
    return localStorage.getItem("orden") || "";
  });

  useEffect(() => {
    if (sl) {
      console.log("Recuperando datos desde localStorage:", sl);
      fetchData(sl);
        // localStorage.setItem("estado_calandra",estado_calandra);

    }
  }, [sl]); // Solo se ejecuta cuando cambia `sl`
  
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


  // Calcular el progreso como porcentaje
  const progress = (xd.producidos / xd.cantidad_total) * 100;

  useEffect(() => {
    // Simulación de actualización de valores para prueba
    const interval = setInterval(() => {
      setChapas((prev) => (prev < chapasT ? prev + 1 : chapasT));
    }, 1000);

    return () => clearInterval(interval);
  }, [chapasT]);

  const fetchData = async (response) => {
    try {
      if (!response)  {
        console.warn("No hay datos válidos en la respuesta del socket");
        return;
      }
      const data = await getSerie(sl);
      setxdxd(data[0])

      const datos = await getOrdenOne(sl); // Llama al método backend con el orden recibido

      if(datos.Estado =="en proceso"){
      setxd(datos); // Actualiza el estado con los datos obtenidos
        if(xdxd.estado_calandra == 0){
          setModalOpenReImpresion(true); // Abre el modal
        }
        const rows = datos ? [datos] : []; // Convierte los datos en un array, si existen
        setData(rows); // Actualiza el estado de la tabla
      }else{
        setxd("");
        setData([]); // Actualiza el estado de la tabla
      }
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }
  };

  const veririfyPvb = async (pvb) => {
    const response = await getOneDatos(pvb);
    if(response.largo<=3000){
      setModalOpenReImpresion(true);
      // localStorage.setItem("pvb", "");
      toast.error(
        `Cambia Pvb: ${response.cod_interno}. Largo sobrante: ${response.largo}mm`,
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

  useEffect(() => {
    fetchData();

    socket.on("listTruckViewData", (hangarData) => {
      if (hangarData && hangarData.length > 0) {
        setData(hangarData);
        const filtered = hangarData.find((item) => item.id_hangar === 1);
        setFilteredData(filtered ? { ...filtered } : null);
      }
    });

    socket.on("truckStateUpdated", (updatedTruck) => {
      if (
        updatedTruck &&
        updatedTruck.id !== null &&
        updatedTruck.id_state !== undefined &&
        updatedTruck.estado
      ) {
        setData((prevData) =>
          prevData.map((truck) =>
            truck.id === updatedTruck.id ? updatedTruck : truck
          )
        );
        if (updatedTruck.id_hangar === 1) {
          setFilteredData({ ...updatedTruck });
        }
      } else {
        // console.warn("El objeto actualizado es nulo o indefinido, o faltan datos clave:", updatedTruck);
        fetchData();
      }
    });

    return () => {
      socket.off("listTruckViewData");
      socket.off("truckStateUpdated");
    };
  }, []);

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

    if (event.key === 'F9') {
      // Prevenir el comportamiento por defecto del tab (enfocar el siguiente input)
      event.preventDefault();
      // Abre el modal de reimpresión
      setModalOpenEdit(true);
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
              Sala Limpia
            </Typography>
          </Box>

          <Box
            sx={{
              height: "35vh",
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
              {xd.cod || ""}
            </Typography>

            {/* <Box sx={{ display: "flex" }}>
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
                {/* LOTE:
              </Typography> */}

              {/* <Typography
                variant="h1"
                sx={{
                  fontSize: "1.5vw",
                  marginLeft: "1vh",
                  paddingTop: "2vh",
                  fontWeight: "600",
                  color: "rgb(206, 220, 0)",
                  textShadow: "2px 2px 2px black",
                }}
              > */}
                {/* Camión: {filteredData.chapa} */}

              {/* </Typography>
            </Box> */}

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
              {xd.descripcion || ""}

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
              {xd.pvb }

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
          <ModalVerificarPvb
            open={modalOpenReImpresion}
            onClose={() => setModalOpenReImpresion(false)}
            orden={xd}
          />
          <ModalEdiPvb
            open={modalOpenEdit}
            onClose={() => setModalOpenEdit(false)}
            orden={xd}
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
              <ReporteSalaLimpia />
            </Box>

          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default SalaLimpia;