import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Select, MenuItem, Chip, FormControl} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ModalCharge from "../../modal/modalCharge";
// import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { PostReporteCalandra, getOneDatos } from "../../services/reporteCalandra.services"; 
// import ModalProblemaCalandra from "../../modal/problemaCalandra/modalCalandra";
import imageCompression from 'browser-image-compression';
import ModalOpcion from "../../modal/problemaCalandra/modalOpcion";
import {getProblemaCalandra} from "../../services/reporteCalandra.services";
import io from 'socket.io-client';
import getApiBaseUrl from "../../utils/getApiBaseUrl";
import getUrlSocket from "../../utils/getUrlSocket";

const ReporteCalandra = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [imageBase64, setImageBase64] = useState("");
  const [problemasCalandra, setProblemasCalandra] = useState([]);


  const USER = localStorage.getItem('id');
  const TURNO = localStorage.getItem('turno');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [serie, setSerieValue] = useState("");
  const [productData, setProductData] = useState(" ");

  const socket = io(getUrlSocket(), {
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    socket.on('mostrar_modal_sala_limpia', (data) => {
      // Otras acciones si es necesario
    });

    return () => {
      socket.off('mostrar_modal_sala_limpia');
    };
  }, []);

  
  // Actualización del useEffect para ejecutar getOneDatos cuando cambia la serie
  useEffect(() => {
    const fetchDatos = async () => {
      if (serie) {
        try {
          const data = await getOneDatos(serie);
          setProductData(data.cod); // Asigna los datos obtenidos al estado
        } catch (error) {
          console.error("Error al obtener datos:", error.message);
        }
      }
    };
    
    fetchDatos();
  }, [serie]); // Dependencia de serie

  const fetchProblemas = async () => {
    try {
      const response = await getProblemaCalandra();
      setProblemasCalandra(response);
    } catch (error) {
      console.error("Error al obtener problemas:", error);
      setError("Error al obtener problemas");
    }
  };

  useEffect(() => {
    fetchProblemas();
  }, []);

  const handleImageChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const formData = new FormData();
        formData.append('image', compressedFile);

        const response = await fetch(`${getApiBaseUrl()}upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setFieldValue('imagenes', data.filePath); // Guarda la ruta de la imagen
          setImageBase64(data.filePath); // Guarda la ruta de la imagen
        } else {
          console.error('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error al comprimir la imagen:', error);
      }
    }
  };


  const handleFormSubmit = async (values, { setFieldValue, resetForm }) => {

    setIsLoading(true);

    const dataToSend = {
      id_problemacalandra: values.problemas.join(", "),
      obs: values.obs,
      entroproblema: values.entroproblema,
      serie: values.serie,
      producto: values.producto || productData,
      imagenes: values.imagenes || " ",
      id_usuario: parseInt(USER),
    };

    try {
      const response = await PostReporteCalandra(dataToSend);
      setTimeout(() => {
        setIsLoading(false);
        setRegistrationSuccess(true);
      }, 3000);
      setProductData(""); 
      resetForm();

    } catch (error) {
      console.error("Error enviando datos:", error);
      setRegistrationError(true);
      setError(error.message);
    } finally{
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleCloseModal = () => setRegistrationSuccess(false);
  const handleCloseModalError = () => setRegistrationError(false);
  const openModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  const handleSelectCalandra = (calandra, setFieldValue) => {
    if (selectedField === "id_problemacalandra") {
      setFieldValue("id_problemacalandra", calandra.id);
      setFieldValue("descripcion", calandra.descripcion);
    }
    setModalOpen(false);
  };

  const openOptionModal = () => setOptionModalOpen(true);
  const handleSelectOption = (option, setFieldValue) => {
    setFieldValue("entroproblema", option);
    setOptionModalOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="Reporte Calandra" subtitle="Reporte Calandra" />

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
        initialValues={{
          id_problemacalandra: "",
          problemas: [],
          obs: "",
          entroproblema: "",
          descripcion: "",
          serie: "",
          producto: "",  
          imagenes: "",
        }}
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
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Serie"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setSerieValue(e.target.value);  // Actualizar estado de serie
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
                  label="Producto"
                  onBlur={handleBlur}
                  value={productData || ""}  // Mostrar el producto obtenido
                  name="producto"
                  error={!!touched.producto && !!errors.producto}
                  helperText={touched.producto && errors.producto}
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{ readOnly: true }}  // Campo de solo lectura
                />

              {/* <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Problema Detectado"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.descripcion}
                  name="id_problemacalandra"
                  error={!!touched.id_problemacalandra && !!errors.id_problemacalandra}
                  helperText={touched.id_problemacalandra && errors.id_problemacalandra}
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{ readOnly: true }}
                  onClick={() => openModal("id_problemacalandra")}
                /> */}

                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                  <Select
                    multiple
                    displayEmpty
                    value={values.problemas}
                    onChange={(e) => setFieldValue("problemas", e.target.value)}
                    renderValue={(selected) => (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {selected.map((descripcion) => (
                          <Chip 
                            key={descripcion} 
                            label={descripcion} 
                            style={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}
                          />
                        ))}
                      </div>
                    )}
                  >
                    {problemasCalandra.map((problema) => (
                      <MenuItem key={problema.id} value={problema.descripcion}>
                        {problema.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.problemas && errors.problemas && <p style={{ color: "red" }}>{errors.problemas}</p>}
                </FormControl>

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Observación"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.obs}
                  name="obs"
                  error={!!touched.obs && !!errors.obs}
                  helperText={touched.obs && errors.obs}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="¿Llegó con problemas?"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.entroproblema}
                  name="entroproblema"
                  error={!!touched.entroproblema && !!errors.entroproblema}
                  helperText={touched.entroproblema && errors.entroproblema}
                  sx={{ gridColumn: "span 2" }}
                  onClick={openOptionModal} // Abre el modal de opciones al hacer clic
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                    sx={{ gridColumn: "span 2" }}
                  >
                    Subir Imagen
                  </Button>
                </label>

                </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Reportar
                </Button>
              </Box>

              <ModalCharge isLoading={isLoading} />

              {/* <ModalProblemaCalandra
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={(calandra) => handleSelectCalandra(calandra, setFieldValue)}
              /> */}
              <ModalOpcion
                open={optionModalOpen}
                onClose={() => setOptionModalOpen(false)}
                onSelect={(option) => handleSelectOption(option, setFieldValue)}
              />
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  problemas: yup.array().of(yup.string()).required("Campo requerido"),
  obs: yup.string().required("Campo requerido"),
  entroproblema: yup.string().required("Campo requerido"),
  serie: yup.string().required("Campo requerido"),
  // producto: yup.string().required("Campo requerido"),
});

export default ReporteCalandra;


