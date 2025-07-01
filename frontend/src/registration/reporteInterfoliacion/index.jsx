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
import ModalOpcionEstado from "../../modal/estadoProblema/modalOpcion";
import { PostReporteInterfoliacion, getOneDatos, getProblemaCalandra } from "../../services/reporteInterfoliacion.services"; 
import ModalCaballete from "../../modal/caballete/modalCaballete";
import imageCompression from 'browser-image-compression';
// import ModalOpcion from "../../modal/problemaCalandra/modalOpcion";
import io from 'socket.io-client';
import getUrlSocket from "../../utils/getUrlSocket";
import getApiBaseUrl from "../../utils/getApiBaseUrl";

const ReporteInterfoliacion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [modalOpenCaballete, setModalOpenCaballete] = useState(false);
  const [estadoModalOpen, setEstadoModalOpen] = useState(false); 
  const [problemasCalandra, setProblemasCalandra] = useState([]);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [imageBase64, setImageBase64] = useState("");
  const USER = localStorage.getItem('id');
  const TURNO = localStorage.getItem('turno');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [serie, setSerieValue] = useState("");
  const [productData, setProductData] = useState(" ");

  const socket = io(getUrlSocket(), {
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    socket.on('mostrar_modal_calandra', (data) => {
      fetchProblemas()
      socket.off('mostrar_modal_calandra');

      // Otras acciones si es necesario
    });

    return () => {
      // socket.off('mostrar_modal_sala_limpia');
    };
  }, []);

  // Actualización del useEffect para ejecutar getOneDatos cuando cambia la serie

  
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
      problema: values.problemas.join(", "),
      obs: values.obs,
      imagen: values.imagenes,
      id_usuario: USER,
      serie: values.serie,
      estado_problema: values.estado_problema,
      id_caballete: values.id_caballete,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostReporteInterfoliacion(dataToSend);
      setRegistrationSuccess(true);
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
    if (selectedField === "id_problema") {
      setFieldValue("id_problema", calandra.id);
      setFieldValue("descripcion", calandra.descripcion);
    }
    setModalOpen(false);
  };

  // const openOptionModal = () => setOptionModalOpen(true);
  // const handleSelectOption = (option, setFieldValue) => {
  //   setFieldValue("entroproblema", option);
  //   setOptionModalOpen(false);
  // };


  const openEstadoModal = () => {
    setEstadoModalOpen(true);
  };

  const handleSelectEstado = (option, setFieldValue) => {
    setFieldValue("estado_problema", option); // Actualiza el valor del campo
    setOptionModalOpen(false); // Cierra el modal después de la selección
  };


  return (
    <Box m="20px">
      <Header title="Reporte Interfoliacion" subtitle="Reporte Interfoliacion" />

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
          problemas: [],
          obs: "",
          estado_problema: "",
          descripcion: "",
          serie: "",
          producto: "",  
          imagenes: "",
          id_caballete: "",
        }}
        // validationSchema={checkoutSchema}
        validationSchema={yup.object().shape({

          problemas: yup.array().min(1, "Selecciona al menos un problema").required("Este campo es obligatorio"),
          obs: yup.string().required("Campo requerido"),
          estado_problema: yup.string().required("Campo requerido"),
          serie: yup.string().required("Campo requerido"),
        })}
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
                  label="Estado Del Problema"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.estado_problema}
                  name="estado_problema"
                  error={!!touched.estado_problema && !!errors.estado_problema}
                  helperText={touched.estado_problema && errors.estado_problema}
                  sx={{ gridColumn: "span 2" }}
                  onClick={openEstadoModal}
                />
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
                label="Id Caballete"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_caballete}
                name="id_caballete"
                error={!!touched.id_caballete && !!errors.id_caballete}
                helperText={touched.id_caballete && errors.id_caballete}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpenCaballete(true)}
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
             <ModalCaballete
              open={modalOpenCaballete}
              onClose={() => setModalOpenCaballete(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("id_caballete", data.id);

                setModalOpen(false);
              }}
              serviceType={1}
            />
              {/* <ModalOpcion
                open={optionModalOpen}
                onClose={() => setOptionModalOpen(false)}
                onSelect={(option) => handleSelectOption(option, setFieldValue)}
              /> */}
              <ModalOpcionEstado
                open={estadoModalOpen}
                onClose={() => setEstadoModalOpen(false)}
                onSelect={(estado) => handleSelectEstado(estado, setFieldValue)} // Maneja la selección de la opción
              />
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  problema: yup.array().of(yup.string()).required("Campo requerido"),
  obs: yup.string().required("Campo requerido"),
  estado_problema: yup.string().required("Campo requerido"),
  serie: yup.string().required("Campo requerido"),

});

export default ReporteInterfoliacion;
