import React, { useState } from "react";
import { Box, Button, Modal, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getOneDatos, putDatos  } from "../../services/owner.services";
import ModalCharge from "../modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";

const ModalEditClients = ({ open, onClose, onSelectClient }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
});

const isNonMobile = useMediaQuery("(min-width:600px)");
 const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          nombre: datos.nombre,
          apellido: datos.apellido,
          direccion: datos.direccion
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
     setIsLoading(true);
     putData(onSelectClient, values);
    
  };
  

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };


  const handleCloseModal = () => {
     setRegistrationSuccess(false);
    // resetForm();
  };

  const putData = async (id, value) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await putDatos(id, value);
      const responseData = await response;
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
            <h1 id="owner-modal-title">Editar Propietario</h1>
           
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
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 0" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellido}
                name="apellido"
                error={!!touched.apellido && !!errors.apellido}
                helperText={touched.apellido && errors.apellido}
                sx={{ gridColumn: "span 3" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Direccion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 2" }}
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

export default ModalEditClients;




