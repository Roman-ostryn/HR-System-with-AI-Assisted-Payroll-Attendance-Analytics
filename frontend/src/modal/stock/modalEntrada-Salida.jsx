import React, { useState } from "react";
import { Box, Button, Modal, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getOne, putDatos } from "../../services/stock.services";
import ModalCharge from "../modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";



const ModalEditInventario = ({ open, onClose, onSelectClient, registro }) => {
  const [data, setData] = useState([]);
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const USER = localStorage.getItem('id');

  const [initialValues, setInitialValues] = useState({
    serie: "",
    cantidad: "",
    descripcion: "",
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await getOne(onSelectClient.cod_interno);
        
        setInitialValues({
          serie: datos.cod_interno,
          cantidad: datos.cantidad_entrada,
        });
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    if (onSelectClient && onSelectClient.serie) {
      fetchData();
    }
  }, [onSelectClient]);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const {cantidad, descripcion} = values;
    
    const valuesToSend = {
      id_caballete: onSelectClient.id_caballete,
      cantidad_entrada: cantidad,
      obs: descripcion,
      movimiento: registro,
      id_usuario: USER,
      cod_empresa: onSelectClient.cod_empresa,
      id_paquete: onSelectClient.id,
    }
    putData(onSelectClient.id, valuesToSend);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handlePrint = async () => {
    if (!onSelectClient || !onSelectClient.id) {
      setErrorMessage('No se ha seleccionado ninguna fila.');
      return;
    }
    const { cod_interno } = onSelectClient;
  
    try {
      const response = await getOne(cod_interno);
      
      // Si response no es un array, conviértelo en uno
      const items = Array.isArray(response) ? response : [response];
      
      const etiquetas = await Promise.all(items.map(async (item) => {
        const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
        let zpl = `
        ^XA
        ^PW800
        ^LL400

        // Código en la parte superior, más grande
        ^FO85,40^A0N,30,30^FDNumero de Serie:${item.cod_interno} ^FS

        ^FO140,80^A0N,25,30^FD${fecha}^FS

        ^FO85,120^A0N,30,30^FDCant. Chapa:^FS
        ^FO140,160^A0N,30,30^FD${item.cantidad}^FS

        ^FO330,120^A0N,30,30^FDUtilizable:^FS
        ^FO380,160^A0N,30,30^FD${item.cantidad_entrada}^FS

        // ID Producción, fecha y serie
        //^FO85,220^A0N,30,30^FDProducto:^FS
        //^FO85,260^A0N,28,26^FD${item.descripcion}^FS

        // Código QR, más grande
        //^FO500,40^BQN,2,8^FDQA,${item.cod_interno}^FS

        ^XZ
      `;
        return zpl;
      }));
      
      
      if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
        window.BrowserPrint.getDefaultDevice("printer", 
          (device) => {
            if (device) {
              setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
              let zplCommand = etiquetas.join("\n");
  
              device.send(zplCommand, function(response) {
                console.log("Datos enviados exitosamente:", response);
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
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setErrorMessage('Error al obtener los datos.');
    }
  
  };


  const putData = async (id, value) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await putDatos(id, value);
      const data = await getOne(onSelectClient.cod_interno);
      handlePrint(onSelectClient);
      setData(data);
      setIsLoading(false);
      setRegistrationSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onClose();
    } catch (error) {
      setIsLoading(false);
      setRegistrationError(true);
      setError(error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="registration-success-modal-title"
      aria-describedby="registration-success-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          paddingLeft: "10px",
          paddingTop: "5px",
          paddingRight: "10px",
          paddingBottom: "10px!important",
          zIndex: 1500,
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="owner-modal-title">Entrada/Salida Inventario</h1>
          </Box>
          <Box
            m="10px 0"
            height="70vh"
            width="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: colors.greenAccent[300] },
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
            }}
          >
            {isLoading && <LoadingSpinner />}

            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={checkoutSchema}
              enableReinitialize
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                  >
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
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Cantidad"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.cantidad}
                      name="cantidad"
                      error={!!touched.cantidad && !!errors.cantidad}
                      helperText={touched.cantidad && errors.cantidad}
                      sx={{ gridColumn: "span 4" }}
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
                      sx={{ gridColumn: "span 4" }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                      Registrar
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
        <ModalCharge isLoading={isLoading} />
        <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
        <ModalError
          open={registrationError}
          onClose={handleCloseModalError}
          error={error}
        />
      </Box>
    </Modal>
  );
};

const checkoutSchema = yup.object().shape({
  serie: yup.string().required("required"),
  cantidad: yup.string().required("required"),
  descripcion: yup.string().required("required"),
});

export default ModalEditInventario;




