import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextField, Box, Button, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { tokens } from '../../theme';
import ModalCharge from "../../modal/modalCharge";
import ModalCaballete from '../../modal/caballete/modalCaballete';
import ModalReImpresion from '../../modal/reImpresion/modalReImpresion';
import ModalDesactivar from '../../modal/desactivar/modalDesactivar';
import ModalClasificacion from "../../modal/clasificacion/modalClasificacion";
import ModalMotivosCalandra from "../../modal/motivosCalandra/modalMotivosCalandra";
import Header from '../../components/Header';
import { FormControl, InputLabel, NativeSelect } from '@mui/material';
import { getOneDatos, PostDatosInterfolacion, getOneDatosTicket } from '../../services/interfoliacion.services';
import { getMotivoCalandra } from "../../services/reporteCalandra.services";
import dayjs from "dayjs";
import QRCode from 'qrcode'
import ModalInterfoliacion from '../../modal/interfoliacion/modalInterfoliacion';
import CompareIcon from '@mui/icons-material/Compare';
import SaveIcon from '@mui/icons-material/Save';

const InterfoliacionMobile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [motivosData, setMotivosData] = useState([]);

  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [modalOpenReImpresion, setModalOpenReImpresion] = useState(false);
  const [modalOpenDesactivar, setModalOpenDesactivar] = useState(false);
  const [modalOpenInterfoliacion, setModalOpenInterfoliacion] = useState(false);
  const [modalOpenMotivo, setModalOpenMotivo] = useState(false);
  const [modalOpenClasifi, setModalOpenClasifi] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [selectedCaballete, setSelectedCaballete] = useState(null);
  const [serieValue, setSerieValue] = useState('');
  const USER = localStorage.getItem('id');
  const TURNO = localStorage.getItem('turno');
  const [printerAvailable, setPrinterAvailable] = useState(true); 
  const formikRef = useRef(null); // useRef en lugar de useState
  const inputRef = useRef(null);

  const initialValues = {
    serie: '',
    cod: '',
    id_producto: '',
    descripcion: '',
    medidas: '',
    id_clasificacion: '',
    defecto: '',
    obs: '',
    id_caballete: '',
    motivo: '',
  };

const generateZPL = async (values) => {
    const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
    console.error('Error generando el QR:', error);
    return null; // Retorna null en caso de error
  });

  let zpl = `
    ^XA
    ^PW800  
    ^LL400  

    ^FO10,40^A0N,40,40^FD${values.cod}^FS

    ^FO30,90^A0N,30,30^FD${values.descripcion}^FS

    ^FO200,130^A0N,35,35^FD${values.medidas}^FS

    ^FO230,200^A0N,35,35^FD${values.clasificacion}^FS

    ^FO150,240^A0N,35,35^FD${values.obs}^FS

    ^FO540,120^BQN,2,8^FDQA,${values.qrImageUrl}^FS

    ^FO20,340^A0N,35,35^FD${values.id_produccion}^FS
    ^FO190,340^A0N,35,35^FD${values.fecha}^FS
    ^FO550,340^A0N,35,35^FD${values.serie}^FS

    ^XZ
  `

if (values.clasificacion != "TIPO A"){
  if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
    window.BrowserPrint.getDefaultDevice("printer", 
    (device) => {
        if (device) {
        setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
        let zplCommand = zpl;
        // 3. Usar la función send para enviar los datos al dispositivo
        device.send(zplCommand, function(response) {
            console.log("Datos enviados exitosamente:", response);
        }, function(error) {
            console.error("Error al enviar datos:", error);
        });
        } else {
        setPrinterInfo("No hay una impresora predeterminada configurada.");
        setPrinterAvailable(false); // No hay impresora disponible
        }
    },
    (error) => {
        setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
        setPrinterAvailable(false); // Error al obtener impresora
    }
    );
  } else {
    setErrorMessage('Ejecutar Activador de Zebra');
    setPrinterAvailable(false); // Si BrowserPrint no está disponible
  }
}

};

const getTicket = async (id_produccion) => {
  const response = await getOneDatosTicket(id_produccion);
  if (response) {
    const { cod, descripcion, medidas, clasificacion, serie, obs, motivo, id_produccion, create_at } = response;
    const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");

    const ticketData = {
      cod: cod,
      descripcion: descripcion,
      medidas: medidas,
      clasificacion: clasificacion,
      serie: serie,
      obs: obs,
      motivo: motivo,
      fecha: fecha,
      id_produccion: id_produccion,
    };

    // Call function to print ticket
    generateZPL(ticketData);
  } else {
    console.error("No se encontró el ticket con el ID proporcionado");
  }
}

  const handleFormSubmit = async (values, { resetForm }) => {
    // Preparar los datos a enviar
    setIsLoading(true);
    const valuesToSend = {
      serie: values.serie,
      id_producto: values.id_producto,
      cod: values.cod,
      descripcion: values.descripcion,
      medidas: values.medidas,
      id_clasificacion: values.id_clasificacion,
      id_caballete: selectedCaballete,
      defecto: values.defecto,
      obs: values.obs,
      motivo: values.motivo,
      id_produccion: values.id_produccion,
      id_usuario: parseInt(USER), // Asegurarse de que `USER` es un número válido
      turno: parseInt(TURNO),
    };

    try {
      // Enviar los datos al backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostDatosInterfolacion(valuesToSend);
      const {id_produccion}= response.resp;
      getTicket(id_produccion);
      setRegistrationSuccess(true);
      resetForm(); // Restablecer el formulario después de enviar
      // generateImageFromPDF(valuesToSend); // Generar el PDF después de enviar
    } catch (error) {
      console.error("Error al enviar los datos", error);
      setRegistrationError(true);
      resetForm(); 
      setIsLoading(false);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
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
      // Abre el modal de reimpresión
      setModalOpenDesactivar(true);
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [serieValue.serie]);

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const OpenModalReImpresion = () => {
    setModalOpenReImpresion(true);
  };

  const CloseModalReImpresion = () => {
    setModalOpenReImpresion(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleSelectCaballete = (id) => {
    setSelectedCaballete(id.id);
    setModalOpen(false);
  };

  // Función para actualizar los valores de Formik
  const setFieldValuesInFormik = (data) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue('id_producto', data.id_producto);
      formikRef.current.setFieldValue('cod', data.cod);
      formikRef.current.setFieldValue('descripcion', data.descripcion);
      formikRef.current.setFieldValue('medidas', data.medidas);
      formikRef.current.setFieldValue('id_clasificacion', data.id_clasificacion);
      formikRef.current.setFieldValue('id_caballete', selectedCaballete);
      formikRef.current.setFieldValue('motivo', data.motivo);
      formikRef.current.setFieldValue('id_produccion', data.id_produccion);
      formikRef.current.setFieldValue('defecto', data.obs);
      formikRef.current.setFieldValue('obs', "Sin Observacion");
    }
  };

  useEffect(() => {
    if (serieValue) {
      const fetchDatos = async () => {
        try {
          const data = await getOneDatos(serieValue);
          setFieldValuesInFormik(data); // Actualizamos los valores de Formik con los datos obtenidos
        } catch (error) {
          console.error("Error al obtener datos:", error.message);
        }
      };

      fetchDatos();
    }

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

  }, [serieValue, selectedCaballete]); // Dependencias actualizadas

  const handleSubmit = (values) => {
    const zplString = generateZPL(values, selectedCaballete);
    // Aquí puedes agregar cualquier otra lógica que necesites, como enviar el ZPL a un servidor.
};

const handleColar = () => {
setModalOpenInterfoliacion(true);
}


  return (
    <Box sx={{ padding: "20px" }}>
      <Header
        title="Registro Laminados Sector Interfoliacion"
        subtitle="Registro de Laminados producidos"
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
      <ModalCaballete
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectCaballete}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        innerRef={formikRef} // Utilizamos ref para evitar ciclo de actualización
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
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
                "& .MuiOutlinedInput-root.MuiOutlinedInput-notchedOutline": {
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
                  zIndex: 200,
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px",
                  zIndex: 100,
                },
              }}
            >
              {/* Mostrar el mensaje de error como un Alert prominente */}
              {errorMessage && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Serie"
                inputRef={inputRef} // Asocia el inputRef al campo
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e); // Llama el handleChange normal de Formik
                  setSerieValue(e.target.value); // Actualiza el valor de serieValue
                }}
                value={values.serie}
                name="serie"
                error={!!touched.serie && !!errors.serie}
                helperText={touched.serie && errors.serie}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Código"
                value={values.cod}
                name="cod"
                error={!!touched.cod && !!errors.cod}
                helperText={touched.cod && errors.cod}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripción"
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Medidas"
                value={values.medidas}
                name="medidas"
                error={!!touched.medidas && !!errors.medidas}
                helperText={touched.medidas && errors.medidas}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Clasificación"
                value={values.id_clasificacion}
                name="id_clasificacion"
                error={!!touched.id_clasificacion && !!errors.id_clasificacion}
                helperText={touched.id_clasificacion && errors.id_clasificacion}
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
                value={values.defecto}
                name="defecto"
                error={!!touched.defecto && !!errors.defecto}
                helperText={touched.defecto && errors.defecto}
                onClick={() => setModalOpenMotivo(true)}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Observacion"
                value={values.obs}
                onChange={handleChange}
                name="obs"
                error={!!touched.obs && !!errors.obs}
                helperText={touched.obs && errors.obs}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Caballete Calandra"
                value={values.id_caballete}
                name="id_caballete"
                error={!!touched.id_caballete && !!errors.id_caballete}
                helperText={touched.id_caballete && errors.id_caballete}
                InputProps={{
                  readOnly: true,
                }}
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
            </Box>
            <Box
              sx={{ paddingRight: "2%", paddingTop: "3%", paddingBottom: "3%" }}
              className="wrap"
            >
              <Button
              
                type="submit"
                color="secondary"
                variant="contained"
                sx={{
                  backgroundColor: "rgb(206, 220, 0)",
                  border: "none",
                  color: "black",
                  height: "7vh",
                  width: "10vw",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginRight: "1vw",

                  "&:hover": { backgroundColor: "#bac609" },
                }}
                startIcon={<SaveIcon />}
              >
                Registrar
              </Button>
              <Button
                type="submit"
                onClick={handleColar}
                sx={{
                  backgroundColor: "rgb(206, 220, 0)",
                  border: "none",
                  color: "black",
                  height: "7vh",
                  width: "10vw",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginTop: "0vw",

                  "&:hover": { backgroundColor: "#bac609" },
                }}
                startIcon={<CompareIcon />}
              >
                Crear Colar
              </Button>
            </Box>
            <ModalCharge isLoading={isLoading} />
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
            <ModalMotivosCalandra
              open={modalOpenMotivo}
              onClose={() => setModalOpenMotivo(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("defecto", data.descripcion);
                setModalOpen(false);
              }}
            />
            <ModalReImpresion
              open={modalOpenReImpresion}
              onClose={() => setModalOpenReImpresion(false)}
              onSelectReImpresion={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("serie", data.serie);
                setModalOpen(false);
              }}
            />
            <ModalDesactivar
              open={modalOpenDesactivar}
              onClose={() => setModalOpenDesactivar(false)}
            />
               <ModalInterfoliacion
              open={modalOpenInterfoliacion}
              onClose={() => setModalOpenInterfoliacion(false)}
              onSelectReImpresion={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("serie", data.serie);
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
  serie: yup.string().required("Requerido"),
  cod: yup.string().required("Requerido"),
  descripcion: yup.string().required("Requerido"),
  medidas: yup.string().required("Requerido"),
  id_clasificacion: yup.number().required("Requerido"),
  defecto: yup.string().required("Requerido"),
  id_caballete: yup.number().required("Requerido"),
});

export default InterfoliacionMobile;