import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  getSerieEtiqueta,
} from "../../services/ordenProduccion.services";
import ModalCharge from "../modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";
import ModalClasificacion from "../../modal/clasificacion/modalClasificacion";
import ModalMotivosCalandra from "../../modal/motivosCalandra/modalMotivosCalandra";
import { putDatosCalandra } from "../../services/calandra.services";

const ModalEditarNS = ({ open, onClose, onSelectClient }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [modalOpenClasifi, setModalOpenClasifi] = useState(false);
  const [modalOpenMotivo, setModalOpenMotivo] = useState(false);
  const USER = localStorage.getItem('id');

  const [initialValues, setInitialValues] = useState({
    serie: "",
    id_clasificacion: "",
    clasificacion_id: "",
    obs: "",
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      if (onSelectClient?.serie) {
        setIsLoading(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const datos = await getSerieEtiqueta(onSelectClient.serie);
          console.log("🚀 ~ fetchData ~ datos:", datos)
          setData(datos);
          setInitialValues({
            serie: datos.serie || "",
            id_clasificacion: datos.clasificacion || "",
            obs: datos.obs || "",
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
  }, [onSelectClient]);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { clasificacion_id, obs } = values;

    const valuesToSend = {
      id_clasificacion: clasificacion_id,
      obs,
      id_update: USER,
    };

    await putData(data.id, valuesToSend, resetForm);
  };

  
  const putData = async (id, value, resetForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await putDatosCalandra(id, value);
      setIsLoading(false);
      setRegistrationSuccess(true);

      resetForm();
      setInitialValues({
        serie: "",
        id_clasificacion: "",
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
          padding: "10px",
          zIndex: 1500,
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1>Editar Chapa</h1>
          </Box>
          <Box
            m="10px 0"
            height="40vh"
            width="80vh"
            sx={{ overflowY: "auto", padding: "10px" }}
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
                setFieldValue,
                resetForm,
              }) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFormSubmit(values, { resetForm });
                  }}
                >
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
                      label="Serie"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.serie}
                      name="serie"
                      error={!!touched.serie && !!errors.serie}
                      helperText={touched.serie && errors.serie}
                      sx={{ gridColumn: "span 2" }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Clasificación"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.id_clasificacion}
                      name="id_clasificacion"
                      error={!!touched.id_clasificacion && !!errors.id_clasificacion}
                      helperText={touched.id_clasificacion && errors.id_clasificacion}
                      sx={{ gridColumn: "span 2" }}
                      InputProps={{
                        readOnly: true,
                      }}
                      onClick={() => setModalOpenClasifi(true)}
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
                      InputProps={{
                        readOnly: true,
                      }}
                      onClick={() => setModalOpenMotivo(true)}
                    />
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained">
                      Editar
                    </Button>
                  </Box>

                  {/* MODALES */}
                  <ModalClasificacion
                    open={modalOpenClasifi}
                    onClose={() => setModalOpenClasifi(false)}
                    onSelect={(data) => {
                      console.log("🚀 ~ ModalEditarNS ~ data:", data)
                      setFieldValue("id_clasificacion", data.descripcion);
                      setFieldValue("clasificacion_id", data.id);
                      setModalOpenClasifi(false);
                    }}
                  />

                  <ModalMotivosCalandra
                    open={modalOpenMotivo}
                    onClose={() => setModalOpenMotivo(false)}
                    onSelect={(data) => {
                      setFieldValue("obs", data.descripcion);
                      setModalOpenMotivo(false);
                    }}
                  />
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
  id_clasificacion: yup.string().required("Campo requerido"),
  obs: yup.string().required("Campo requerido"),
});

export default ModalEditarNS;
