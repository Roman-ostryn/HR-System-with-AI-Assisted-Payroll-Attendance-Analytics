import React, { useState } from "react";
import { Box, Button, Modal, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getOneDatos } from "../../services/garden.services";
import ModalCharge from "../modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";


const ModalEditWorks = ({ open, onClose, onSelectClient }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [entrada, setEntrada] = useState(null);
  const [salida, setSalida] = useState(null);
  const [initialValues, setInitialValues] = useState({
    id_propietario: "",
      abono: "",
      fumigacion: "",
      vestringias: "",
      abono_universal: "",
      nombre:  "",
      entrada: null,
      salida: null,
  });

const isNonMobile = useMediaQuery("(min-width:600px)");
 const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dateToEpochTimestamp = (dateString) => {
    return dayjs(dateString).unix();
  };


  useEffect(() => {
    // Almacenar el valor anterior de initialValues
    const prevInitialValues = initialValues;
    // Verificar si initialValues es diferente al valor anterior
    if (initialValues !== prevInitialValues) {
      // Volver a renderizar el componente al actualizar initialValues
    }
  }, [initialValues]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await getOneDatos(onSelectClient);
        setData(datos);
        setInitialValues({
          id_propietario: datos.id_propietario,
          abono:datos.abono,
          fumigacion:datos.fumigacion,
          vestringias:datos.vestringias,
          abono_universal:datos.abono_universal,
          nombre:datos.nombre,
          entrada: datos.entrada,
          salida:datos.salida,
        })
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    if (onSelectClient > 0) {
      fetchData();
    }
  }, [onSelectClient]);


    const handleFormSubmit = async (values) => {
      // setIsLoading(true);
      let entradaEpochTimestamp = dateToEpochTimestamp(entrada);
      let salidaEpochTimestamp = dateToEpochTimestamp(salida);
  
      if (entrada === null) {
        entradaEpochTimestamp = undefined;
      }
      if (salida === null) {
        salidaEpochTimestamp = undefined;
      }
  
      const { nombre, ...valuesWithoutNombre } = values;
  
      const valuesToSend = {
        ...valuesWithoutNombre,
        entrada: entradaEpochTimestamp,
        salida: salidaEpochTimestamp,
      };
      // PostData(valuesToSend);
    };
    //  putData(onSelectClient, values);
    
  

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };


  const handleCloseModal = () => {
     setRegistrationSuccess(false);
    // resetForm();
  };

  // const putData = async (id, value) => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 3000));
  //     const response = await putDatos(id, value);
  //     const responseData = await response;
  //     setIsLoading(false);
  //     setRegistrationSuccess(true);
  //     await new Promise((resolve) => setTimeout(resolve, 3000));
  //     onClose();
  //   } catch (error) {
  //       setIsLoading(false);
  //       setRegistrationError(true);
  //       setError(error.message);
  //   }
  // };

  

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
      BackdropProps={{
        // style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
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
            <h1 id="owner-modal-title">Editar Actividades</h1>
           
          </Box>
          <Box m="10px 0" height="70vh" width="80vh" sx={{ "& .MuiDataGrid-root": { border: "none" }, "& .MuiDataGrid-cell": { borderBottom: "none" }, "& .name-column--cell": { color: colors.greenAccent[300] }, "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[900], borderBottom: "none" }, "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] }, "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[900] }, "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` }, }}
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
                label="Id_Propietario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_propietario}
                name="id_propietario"
                error={!!touched.id_propietario && !!errors.id_propietario}
                helperText={touched.id_propietario && errors.id_propietario}
                sx={{ gridColumn: "span 0" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 3" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Abono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.abono}
                name="abono"
                error={!!touched.abono && !!errors.abono}
                helperText={touched.abono && errors.abono}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Vestringias"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.vestringias}
                name="vestringias"
                error={!!touched.vestringias && !!errors.vestringias}
                helperText={touched.vestringias && errors.vestringias}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Abono Universal"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.abono_universal}
                name="abono_universal"
                error={!!touched.abono_universal && !!errors.abono_universal}
                helperText={
                  touched.abono_universal && errors.abono_universal
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Fumigacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fumigacion}
                name="fumigacion"
                error={!!touched.fumigacion && !!errors.fumigacion}
                helperText={touched.fumigacion && errors.fumigacion}
                sx={{ gridColumn: "span 2" }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2} sx={{ minWidth: "210%" }}>
                  <DateTimePicker
                    label={"Entrada"}
                    value={entrada}
                    name="entrada"
                    onChange={setEntrada}
                    referenceDate={dayjs("2022-04-17T15:30")}
                    error={!!touched.salida && !!errors.salida}
                    helperText={touched.salida && errors.salida}
                  />
                </Stack>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                  <Stack
                    spacing={2}
                    sx={{ minWidth: "210%", marginLeft: "110%" }}
                  >
                    <DateTimePicker
                      label={"Salida"}
                      value={salida}
                      name="salida"
                      onChange={setSalida}
                      referenceDate={dayjs("2022-04-17T15:30")}
                      error={!!touched.salida && !!errors.salida}
                      helperText={touched.salida && errors.salida}
                    />
                  </Stack>
                </ThemeProvider>
              </LocalizationProvider>
          
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Guardar
              </Button>
            </Box>
          </form>
          
        )}
      </Formik>
          </Box>
        </Box>
        {/* <Button onClick={handleRowDoubleClick} color="secondary" variant="contained" style={{ marginTop: "10px" }}>
          Seleccionar
        </Button> */}
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
  nombre: yup.string().required("required"),
  apellido: yup.string().required("required"),
  direccion: yup.string().required("required"),
  
});

export default ModalEditWorks;




