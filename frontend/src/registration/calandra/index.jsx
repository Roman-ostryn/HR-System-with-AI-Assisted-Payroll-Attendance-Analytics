import { Box, Button, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { tokens } from "../../theme";
import ModalCharge from "../../modal/modalCharge";
import ModalProducto from "../../modal/producto/modalProducto";
import ModalClasificacion from "../../modal/clasificacion/modalClasificacion";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import ModalPvb from "../../modal/pvb/modalPvb";
import { getOneDatosTicket, PostDatosCalandra } from "../../services/calandra.services";
import ModalMotivosCalandra from "../../modal/motivosCalandra/modalMotivosCalandra";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { getMotivoCalandra } from "../../services/reporteCalandra.services";
import "../../css/styles.css"
import dayjs from "dayjs";
// import jsPDF from 'jspdf';
// import QRCode from "react-qr-code";
import QRCode from 'qrcode'
import io from 'socket.io-client';
import getUrlSocket from "../../utils/getUrlSocket";



const Calandra = () => {
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenClasifi, setModalOpenClasifi] = useState(false);
  const [modalOpenCaballete, setModalOpenCaballete] = useState(false);
  const [modalOpenPvb, setModalOpenPvb] = useState(false);
  const [modalOpenMotivo, setModalOpenMotivo] = useState(false);
  const [motivosData, setMotivosData] = useState([]);
  // const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [temperatura, setTemperatura] = useState([]);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const Turno = localStorage.getItem('turno');
  const USER = localStorage.getItem('id');

  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const idProductoRef = useRef(null); 

  const socket = io(getUrlSocket(), {
    transports: ['websocket', 'polling']
  });

  const waitingForNextUpdate = useRef(false); // useRef mantiene el valor entre renders

  useEffect(() => {
    let timeoutId = null; // Variable para almacenar el timeout
    // let waitingForNextUpdate = false; // Controla si debe ignorar los valores entrantes
  
    const handleTemperatura = (data) => {
  
      if (data.temperatura === "nan" || data.temperatura > 100) {
        // Si el valor es inválido, lo ignora y sigue esperando el siguiente
        console.log("Valor inválido, ignorando...");
        return;
      }
  
      if (waitingForNextUpdate) {
        console.log("Esperando 30 segundos, ignorando valor:", data.temperatura);
        return; // Ignora el valor si está en la espera de 30 segundos
      }
  
      setTemperatura(data.temperatura);
      waitingForNextUpdate = true; // Activa el bloqueo de nuevas actualizaciones
  
      // Iniciar un timeout de 30 segundos antes de permitir nuevas actualizaciones
      timeoutId = setTimeout(() => {
        waitingForNextUpdate = false;
        console.log("Se pueden recibir nuevas temperaturas.");
      }, 30000);
    };
  
    // Escuchar eventos de temperatura actualizada
    socket.on("temperaturaActualizada", handleTemperatura);
  
    return () => {
      clearTimeout(timeoutId); // Limpiar el timeout al desmontar el componente
      socket.off("temperaturaActualizada", handleTemperatura);
    };
  }, []); // No dependemos de `temperatura`, solo ejecutamos la lógica una vez al montar
  
  
  
  const handleTemperatura = (event) => {
    setTemperatura(event.target.value);
  };


  useEffect(() => {
    try {
      const fetchMotivos = async () => {
        const response = await getMotivoCalandra();
        // const motivos = response.map()
        setMotivosData(response);
        
    }
    fetchMotivos();  
    } catch (error) {
      console.error('Error al obtener datos del backend:', error);
    }

  }, [])

  const initialValues = {
    id_producto: "",
    cod: "",
    descripcion: "",
    serie:  "",
    id_clasificacion: "",
    id_categoria:  "",
    medidas:  "",
    cantidad: "",
    temperatura: "",
    id_caballete: "",
    obs: "",
    motivo: "",
    id_pvb: "",
    id_horarios: ""

  };

  
  const generateZPL = async (values) => {
    const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
    console.error('Error generando el QR:', error);
    return null; // Retorna null en caso de error
  });


  // let zpl = `
  // ^XA
  // ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
  // ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)

  // // Código en la parte superior, más grande
  // ^FO10,20^A0N,40,40^FD${values.cod}^FS

  // // Descripción, tamaño aumentado
  // ^FO30,70^A0N,30,30^FD${values.descripcion}^FS

  // // Medidas
  // ^FO200,110^A0N,35,35^FD${values.medidas}^FS

  // // Clasificación

  // ^FO230,180^A0N,35,35^FD${values.clasificacion}^FS

  // // Observaciones
  //  ^FO150,220^A0N,35,35^FD${values.obs}^FS

  // // Código QR, más grande

  // ^FO540,100^BQN,2,8^FDQA,${values.qrImageUrl}^FS

  // // ID Producción, fecha y serie
  // ^FO20,320^A0N,35,35^FD${values.id_produccion}^FS
  // ^FO190,320^A0N,35,35^FD${values.fecha}^FS
  // ^FO550,320^A0N,35,35^FD${values.serie}^FS

  // ^XZ
  // `
  // if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
  //   window.BrowserPrint.getDefaultDevice("printer", 
  //   (device) => {
  //       if (device) {
  //       setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
  //       let zplCommand = zpl;

  //       // 3. Usar la función send para enviar los datos al dispositivo
  //       device.send(zplCommand, function(response) {
  //           console.log("Datos enviados exitosamente:", response);
  //       }, function(error) {
  //           console.error("Error al enviar datos:", error);
  //       });
  //       } else {
  //       setPrinterInfo("No hay una impresora predeterminada configurada.");
  //       }
  //   },
  //   (error) => {
  //       setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
  //   }
  //   );
  // } else {
  //   setErrorMessage('BrowserPrint no está disponible.');
  // }
  };

  const handleFormSubmit = async (values, { setFieldValue, resetForm }) => {
    setIsLoading(true);
    

     // Verificar si "obs" es "SIN DEFECTOS" y si el "motivo" está vacío
      if (values.obs === "SIN DEFECTOS" && values.motivo === "") {
      values.motivo = "SIN PROBLEMAS";
     }
    
    const valuesToSend = {
      ...values,
      id_producto: parseInt(values.id_producto),
      id_clasificacion: parseInt(values.id_clasificacion),
      id_categoria: parseInt(values.id_categoria),
      id_caballete: parseInt(values.id_caballete),
      id_pvb: parseInt(values.id_pvb),
      cantidad: 1, // Ajusta esto según sea necesario
      id_horarios: parseInt(Turno),
      id_usuario: parseInt(USER),
      temperatura: temperatura
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await PostDatosCalandra(valuesToSend);
      const {id_produccion} = response.resp;    
      setRegistrationSuccess(true);
      getTicket(id_produccion);
      if (idProductoRef.current) {
        idProductoRef.current.focus();
      }
      setFieldValue("serie", "");
      setFieldValue("temperatura", "");
    } catch (error) {
      console.error("error sending data", error);
      setRegistrationError(true);
      setIsLoading(false);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const openModalProducto = () => {
    setModalOpen(true); // Abrir modal de productos
  };

  const getTicket = async (id) => {
    const response = await getOneDatosTicket(id);
    if (response) {
      const { cod, descripcion, medidas, clasificacion, serie, id_produccion,obs, created_At } = response;
      const fecha = dayjs(created_At).format("DD/MM/YYYY hh:mm");

      const ticketData = {
        cod: cod,
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

  return (
    <Box m="20px">
      <Header
        title="Registro Laminados Sector Calandra"
        subtitle="Registro de Lamninados producidos"
      />

      {isLoading && <LoadingSpinner />}
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

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },

                "& .MuiOutlinedInput-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  background: `${colors.primary[950]} !important`,
                  borderBottom: `1px solid ${colors.grey[100]} !important`,
                },
                "& .MuiInputBase-input": {
                  color: `${colors.grey[100]} !important`,
                },

                "& .MuiInputLabel-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiSvgIcon-root": {
                  color: `${colors.grey[100]} !important`,
                  zIndex: 10,
                },
                "& .MuiInputLabel-root": {
                  zIndex: 200, // Aumentamos el z-index del label para que esté sobre el fondo
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px",
                  zIndex: 100,
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_producto}
                name="id_producto"
                error={!!touched.id_producto && !!errors.id_producto}
                helperText={touched.id_producto && errors.id_producto}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                  // onClick: setModalOpen(true),
                }}
                onClick={openModalProducto}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Codigo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cod}
                name="cod"
                error={!!touched.cod && !!errors.cod}
                helperText={touched.cod && errors.cod}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripcion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Categoria"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_categoria}
                name="id_categoria"
                error={!!touched.id_categoria && !!errors.id_categoria}
                helperText={touched.id_categoria && errors.id_categoria}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Medidas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.medidas}
                name="medidas"
                error={!!touched.medidas && !!errors.medidas}
                helperText={touched.medidas && errors.medidas}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: values.cod !== "VIDRIOCORTADO", // Habilitar el campo solo si el código es VIDRIOCORTADO
                }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Clasificacion"
                onBlur={handleBlur}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange(e); // Cambia el valor de id_clasificacion

                  // Si el id_clasificacion es 1, establece "SIN DEFECTOS" y "SIN PROBLEMAS"
                  if (value === "1") {
                    setFieldValue("obs", "SIN DEFECTOS");
                    setFieldValue("motivo", "SIN PROBLEMAS");
                  } else {
                    // Restablece los valores si id_clasificacion cambia a otro valor
                    setFieldValue("obs", "");
                    setFieldValue("motivo", "");
                  }
                }}
                value={values.id_clasificacion}
                name="id_clasificacion"
                error={!!touched.id_clasificacion && !!errors.id_clasificacion}
                helperText={touched.id_clasificacion && errors.id_clasificacion}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpenClasifi(true)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Defecto"
                onBlur={handleBlur}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange(e); // Cambia el valor del campo "obs"

                  // Si el valor es "SIN DEFECTOS", establece automáticamente el motivo
                  if (value === "SIN DEFECTOS") {
                    setFieldValue("motivo", "SIN PROBLEMAS");
                  } else {
                    // Si cambia a otro valor, restablece el motivo a un string vacío
                    setFieldValue("motivo", "");
                  }
                }}
                value={values.obs}
                name="obs"
                error={!!touched.obs && !!errors.obs}
                helperText={touched.obs && errors.obs}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  
                }}
                onClick={() => setModalOpenMotivo(true)}
              />

              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Seleccione el Motivo
                  </InputLabel>
                  <NativeSelect
                    inputProps={{
                      name: "motivo",
                      id: "uncontrolled-native",
                    }}
                    value={values.motivo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.motivo && !!errors.motivo}
                    disabled={values.obs === "SIN DEFECTOS"} // Desactivar el select si obs es "SIN DEFECTOS"
                  >
                    <option value=""></option>
                    {motivosData.map((motivo) => (
                      <option key={motivo.id} value={motivo.descripcion}>
                        {motivo.descripcion}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperatura"
                onBlur={handleBlur}
                onChange={handleTemperatura}
                value={temperatura}
                name="temperatura"
                error={!!touched.temperatura && !!errors.temperatura}
                helperText={touched.temperatura && errors.temperatura}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Caballete"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_caballete}
                name="id_caballete"
                error={!!touched.id_caballete && !!errors.id_caballete}
                helperText={touched.id_caballete && errors.id_caballete}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpenCaballete(true)}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Pvb"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_pvb}
                name="id_pvb"
                error={!!touched.id_pvb && !!errors.id_pvb}
                helperText={touched.id_pvb && errors.id_pvb}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpenPvb(true)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Serie"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serie}
                name="serie"
                error={!!touched.serie && !!errors.serie}
                helperText={touched.serie && errors.serie}
                sx={{ gridColumn: "span 1" }}
                InputProps={
                  {
                    // readOnly: true,
                  }
                }
              />
              {/* <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    variant="standard"
                    htmlFor="uncontrolled-native"
                  ></InputLabel>
                  <NativeSelect
                    inputProps={{
                      name: "id_horarios",
                      id: "uncontrolled-native",
                    }}
                    value={values.id_horarios}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.id_horarios && !!errors.id_horarios}
                  >
                    <option value={0}>SELECCIONE EL TURNO</option>
                    <option value={3}>Primer Turno</option>
                    <option value={4}>Segundo Turno</option>
                  </NativeSelect>
                  {touched.id_horarios && errors.id_horarios && (
                    <div style={{ color: "red" }}>{errors.id_horarios}</div>
                  )}
                </FormControl>
              </Box> */}
            </Box>

            <Box sx={{ paddingRight: "2%", paddingTop: "1.5%", paddingBottom:"3%" }} className="wrap" >
              <Button className="button-animation" type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>
           {/* <Box sx={{ paddingRight: "2%", paddingTop: "0.5%", paddingBottom:"3%" }}>
         <Button sx={{height:"120%"}} type="submit" color="secondary" variant="contained" onClick={handleGenerate}>
            Generar Ticket
          </Button>
        </Box>  */}
            <ModalCharge isLoading={isLoading} />
            <ModalProducto
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              serviceType={1}
              onSelectProduct={(producto) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("id_producto", producto.id);
                setFieldValue("cod", producto.cod);
                setFieldValue("descripcion", producto.descripcion);
                setFieldValue("id_categoria", producto.id_categoria);
                setFieldValue("medidas", producto.medidas);

                setModalOpen(false);
                
              }}
              // serviceType={1}
            />
            <ModalClasificacion
              open={modalOpenClasifi}
              onClose={() => setModalOpenClasifi(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("id_clasificacion", data.id);
                setFieldValue("obs", data.obs);
                setFieldValue("motivo", data.motivo);
                setModalOpen(false);
              }}
            />
            <ModalCaballete
              open={modalOpenCaballete}
              onClose={() => setModalOpenCaballete(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("id_caballete", data.id);

                setModalOpen(false);
              }}
              serviceType={0}
            />
            <ModalPvb
              open={modalOpenPvb}
              onClose={() => setModalOpenPvb(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("id_pvb", data.id);

                setModalOpen(false);
              }}
            />
            <ModalMotivosCalandra
              open={modalOpenMotivo}
              onClose={() => setModalOpenMotivo(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("obs", data.descripcion);

                setModalOpen(false);
              }}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
    //  id: yup.string().required("Requerido"),
    cod: yup.string().required("Requerido"),
    descripcion:yup.string().required("Requerido"),
    serie: yup.string().required("Requerido"),
    id_clasificacion: yup.number().required("Requerido"),
    id_categoria:  yup.number().required("Requerido"),
    medidas: yup.string().required("Requerido"),
    // cantidad:  yup.number().required("Requerido"),
    // temperatura: yup.string().required("Requerido"),
    id_caballete: yup.number().required("Requerido"),
    obs: yup.string().required("Requerido"),
    // motivo: yup.string().required("Requerido"),
    id_pvb: yup.number().required("Requerido"),
    // id_horarios: yup.number()
});

export default Calandra; 

