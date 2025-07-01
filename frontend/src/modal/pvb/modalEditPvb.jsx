import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getOnePvb, putDatos } from "../../services/pvb.services";
import ModalCharge from "../modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";

const ModalEdiPvb = ({ open, onClose, onSelectClient }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
    serie: "",
    largo: "",
    obs: "",
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      if (initialValues.serie) {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); 
          const datos = await getOnePvb(initialValues.serie);
          setData(datos);
          setInitialValues({
            serie: datos.cod_interno,
            largo: datos.largo,
            obs: datos.obs,
          });
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
          setRegistrationError(true);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [initialValues.serie]);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { serie, largo, obs } = values;

    const valuesToSend = {
      largo,
      obs,
      status_active: 2,
    };

    await putData(data.id, valuesToSend, resetForm);
  };

  const putData = async (id, value, resetForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await putDatos(id, value);
      setIsLoading(false);
      setRegistrationSuccess(true);

      // Limpiar inputs después de editar
      resetForm();
      setInitialValues({
        serie: "",
        largo: "",
        obs: "",
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      onClose();
    } catch (error) {
      setIsLoading(false);
      setRegistrationError(true);
      setError(error.message);
    }
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
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
            <h1 id="owner-modal-title">Editar Pvb</h1>
          </Box>
          <Box m="10px 0" height="40vh" width="80vh" sx={{ overflowY: "auto", padding: "10px" }}>
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
                resetForm
              }) => (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleFormSubmit(values, { resetForm });
                }}>
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
                      onChange={(e) => {
                        handleChange(e);
                        setInitialValues((prevValues) => ({
                          ...prevValues,
                          serie: e.target.value,
                        }));
                      }}
                      value={values.serie}
                      name="serie"
                      error={!!touched.serie && !!errors.serie}
                      helperText={touched.serie && errors.serie}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Largo"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.largo}
                      name="largo"
                      error={!!touched.largo && !!errors.largo}
                      helperText={touched.largo && errors.largo}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Obs"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.obs}
                      name="obs"
                      error={!!touched.obs && !!errors.obs}
                      helperText={touched.obs && errors.obs}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                      Editar
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
  serie: yup.string().required("Campo requerido"),
  largo: yup.string().required("Campo requerido"),
  obs: yup.string().required("Campo requerido"),
});

export default ModalEdiPvb;
