import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid"; // Asegúrate de instalar y usar @mui/x-data-grid
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles"; // Importa useTheme desde MUI
import { tokens } from "../../theme"; // Asegúrate de que tokens esté definido en tu tema
import { getDatosUser } from "../../services/user.services"; // Asegúrate de tener este servicio
import { Box, Button, Modal, TextField, Alert } from "@mui/material";
import LoadingSpinner from "../../loadingSpinner";
import * as yup from "yup";
import ModalCharge from "../modalCharge";
import { Formik } from "formik";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from "dayjs";
import ModalSuccess from "../modalSucces";
import Lavadora from "../../queries/lavadora";
import { updateLavadora } from "../../services/lavadoraSocket.services";
import { isValid } from "date-fns";
import { getOneOrdenProduccionxd } from "../../services/ordenProduccion.services";

const ModalLavadoraStar = ({ open, onClose, modalParse, buttonEnabled, order}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errorAlert, setErrorAlert] = useState(null); 
  const [buttonEnable, setButtonEnable] = useState(true);
  const [buttonDisable, setButtonDisable] = useState(false);


  const [filteredData, setFilteredData] = useState([]);
  const [dataParse, setdataParse] = useState({});
  const [initialValues, setInitialValues] = useState({
    caballete1: dataParse.caballete1,
    caballete2: dataParse.caballete2,
    caballete3: dataParse.caballete3,
    cantidad_total: dataParse.cantidad_total,
    orden: dataParse.orden,
    Estado: 2,
    estado_calandra: 0,
    cod: dataParse.cod

  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    if (modalParse) {
      setdataParse({ ...modalParse }); // Clona el objeto para forzar un cambio de referencia
      setInitialValues({
        caballete1: modalParse.caballete1 || "0",
        caballete2: modalParse.caballete2 || "0",
        caballete3: modalParse.caballete3 || "0",
        caballete4: modalParse.caballete4 || "0",
        cantidad_total: modalParse.cantidad_total || "0",
        orden: modalParse.orden || "0",
        Estado: 2,
       cod: modalParse.cod || ""

      });
    }
  }, [modalParse]);

  
  // useEffect(() => {
  
  //     buttonEnabled(buttonEnable); // Envía el salario seleccionado
     
  // }, [buttonEnable])
  
  useEffect(() => {
    const handleorder = () => {
      order(initialValues.orden); // Envía el salario seleccionado
    };

    handleorder();
  }, [order])
  

  const handleFormSubmit = async (values) => {
   
    const isValid = handleVerifyCaballete(values);
    if (!isValid) {
      console.log("Form submission aborted due to validation error.");
      return;
    }
    
    try {
    setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const valuesxd = ({...values, estado_calandra:0});
      const response = await updateLavadora(dataParse.orden, valuesxd);
      // localStorage.setItem("paquete1", values.caballete1);
      // localStorage.setItem("paquete2", values.caballete2);
      localStorage.setItem("Estado", initialValues.Estado);
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
  };


  const handleVerifyCaballete = (values) => {
    const { caballete1, caballete2 } = values;
  
    // Verifica si cualquiera de los caballetes está en "0"
    if (caballete1 === "0" || caballete2 === "0") {
      setErrorAlert("Debes Vipear al menos 2 Paquetes");
      return false;
    } else {
      setErrorAlert(null);
      return true;
    }
  };
  


  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
    setButtonEnable(true);
    buttonEnabled(false); 
    onClose();

    // resetForm();
  };

  // useEffect(() => {
  //   // Obtener los salarios desde la base de datos
  //   const fetchUser = async () => {
  //     try {
  //       const response = await getDatosUser();
  //       setUsuarios(response);
  //       setFilteredData(response);
  //     } catch (error) {
  //       console.error('Error al obtener datos del backend:', error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-horario-title"
      aria-describedby="modal-horario-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          paddingLeft: "1vw",
          paddingTop: "5px",
          paddingRight: "1vw",
          paddingBottom: "10px!important",
          zIndex: 1500,
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="owner-modal-title">Vipear Paquetes</h1>
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
              key={JSON.stringify(initialValues)} // Fuerza el re-renderizado si cambian los valores iniciales
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
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                      },
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Paquete 1"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.caballete1}
                      name="caballete1"
                      error={!!touched.caballete1 && !!errors.caballete1}
                      helperText={touched.caballete1 && errors.caballete1}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Paquete2"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.caballete2}
                      name="caballete2"
                      error={!!touched.caballete2 && !!errors.caballete2}
                      helperText={touched.caballete2 && errors.caballete2}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Paquete3"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.caballete3}
                      name="caballete3"
                      error={!!touched.caballete3 && !!errors.caballete3}
                      helperText={touched.caballete3 && errors.caballete3}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Paquete4"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.caballete4}
                      name="caballete4"
                      error={!!touched.caballete4 && !!errors.caballete4}
                      helperText={touched.caballete4 && errors.caballete4}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                
                 
                  <Box display="flex" justifyContent="end" mt="20px">
                  <Box
                  sx={{
                    width:"55vw",
                    marginTop:"2.4vh",
                    marginRight:"2vw"
                  }}>
                  {errorAlert && (
                    <Alert severity="error" sx={{ marginBottom: "20px" }}>
                      {errorAlert}
                    </Alert>
                  )}
                  </Box>
                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: "rgb(206, 220, 0)",
                        border: "none",
                        color: "black",
                        height: "6vh",
                        width: "20vw",
                        borderRadius: "20px",
                        cursor: "pointer",
                        marginTop: "1vw",

                        "&:hover": { backgroundColor: "#bac609" },
                      }}
                    >
                      {" "}
                      Iniciar{" "}
                    </Button>{" "}
                    {/* <Button type="submit" color="secondary" variant="contained">
                Guardar
              </Button> */}
              
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

        {/* <Lavadora modalParse={handleSelectOrden}/> */}
      </Box>
    </Modal>
  );
};
const checkoutSchema = yup.object().shape({
  caballete1: yup.string().required("required"),
  caballete2: yup.string().required("required"),
});

export default ModalLavadoraStar;
