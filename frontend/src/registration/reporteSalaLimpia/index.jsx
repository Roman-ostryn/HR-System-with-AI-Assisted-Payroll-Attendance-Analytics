
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Select, MenuItem, Chip, FormControl} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup"; 
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
// import LoadingSpinner from "../../loadingSpinner";
import ModalCharge from "../../modal/modalCharge";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalOpcion from "../../modal/problemaSalaLimpia/modalOpcion";
import ModalOpcionEstado from "../../modal/estadoProblema/modalOpcion";
// import {getProblemaCalandra} from "../../services/reporteCalandra.services";
// import ModalOpcion from "../../modal/problemaSalaLimpia/modalOpcion";
import { PostReporteSalaLimpiaSK, getProblemaSalaLimpia } from "../../services/reporteSalaLimpia.services";
import imageCompression from 'browser-image-compression';
import io from 'socket.io-client';
import ModalProblema from '../../modal/problema/modalProblema';
import getUrlSocket  from "../../utils/getUrlSocket";
import getApiBaseUrl from "../../utils/getApiBaseUrl";


// Definir el esquema de validación con yup
const checkoutSchema = yup.object().shape({
  problemas: yup.array().of(yup.string()).required("El problema detectado es requerido"),
  obs: yup.string().required("La observación es requerida"),
  entroproblema: yup.string().required("Se debe especificar si llegó con problemas"),
  imagenes: yup.string().required("La imagen es requerida"),
});

const ReporteSalaLimpia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const [problemasCalandra, setProblemasCalandra] = useState([]); 


  const USER = localStorage.getItem('id');
  const TURNO = localStorage.getItem('turno');
  // Conexión de Socket.IO
  const socket = io(getUrlSocket(), {
    transports: ['websocket', 'polling']
  });
  
  const [open, setOpen] = useState(false);
  const [registroLavadora, setRegistroLavadora] = useState(null);
  const [registroCalandra, setRegistroCalandra] = useState(null); // Para calandra
  const [optionModalOpenEstado, setOptionModalOpenEstado] = useState(false);



  const fetchProblemas = async () => {
    try {
      const response = await getProblemaSalaLimpia();
      setProblemasCalandra(response);
    } catch (error) {
      console.error("Error al obtener problemas:", error);
      setError("Error al obtener problemas");
    }
  };

  useEffect(() => {
    fetchProblemas();
  }, []);

  const initialValues = {
    id_problemasalalimpia: "",
    problemas: [],
    descripcion: "",
    obs: "",
    entroproblema: "",
    imagenes: " ",
    estado_problema: "",
    // id_usuario: "",
    id_registro: 560,
    // id_registro: 1,

  };

  const openModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  const handleSelectSalaLimpia = (salaLimpia, setFieldValue) => {
    if (selectedField === "id_problemasalaLimpia") {
      setFieldValue("id_problemasalalimpia", salaLimpia.id);
      setFieldValue("descripcion", salaLimpia.descripcion);
    }
    setModalOpen(false);
  };

  const openOptionModal = () => {
    setOptionModalOpen(true);
  };

  const handleSelectOption = (option, setFieldValue) => {
    setFieldValue("entroproblema", option);
    setOptionModalOpen(false);
  };

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

  // Emitir evento a calandra y manejar formulario
  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
  
    const dataToSend = {
      id_problemasalalimpia: values.problemas.join(", "),
      obs: values.obs,
      entroproblema: values.entroproblema,
      imagenes: imageBase64,
      estado_problema: values.estado_problema,
      id_usuario: USER,
      id_registro: values.id_registro || null,
      turno: TURNO || "a definir",
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostReporteSalaLimpiaSK(dataToSend);
      setRegistrationSuccess(true);
      setRegistroLavadora({
        id: values.id_problemasalalimpia,
        descripcion: values.descripcion,
      });
      resetForm();
      // setOpen(true);
    } catch (error) {
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openOptionModalEstado = () => {
    setOptionModalOpenEstado(true);
  };

  const handleSelectOptionEstado = (option, setFieldValue) => {
    setFieldValue("estado_problema", option); // Actualiza el valor del campo
    setOptionModalOpenEstado(false); // Cierra el modal después de la selección
  };

  return (
    <Box m="20px">
      <Header title="Reporte Sala Limpia" subtitle="Reporte Sala Limpia" />

      {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
      {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={error} />}

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Problema Detectado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_problemasalalimpia}
                name="id_problemasalalimpia"
                error={!!touched.id_problemasalalimpia && !!errors.id_problemasalalimpia}
                helperText={touched.id_problemasalalimpia && errors.id_problemasalalimpia}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: true }}
                onClick={() => openModal("id_problemasalaLimpia")}
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
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripción"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: true }}
              /> */}
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
                onClick={openOptionModalEstado}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Observaciones"
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
                label="Entró con problemas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.entroproblema}
                name="entroproblema"
                error={!!touched.entroproblema && !!errors.entroproblema}
                helperText={touched.entroproblema && errors.entroproblema}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: true }}
                onClick={openOptionModal}
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
            {/* <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Enviar
              </Button>
            </Box> */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" sx={{backgroundColor:"#cedc00 !important"}}>
                Reportar
              </Button>
            </Box>
                  {/* Modales */}
            <ModalCharge isLoading={isLoading} />

            {/* <ModalProblemaCalandra open={modalOpen} onClose={() => setModalOpen(false)} onSelect={(salaLimpia) => handleSelectSalaLimpia(salaLimpia, setFieldValue)} /> */}
            <ModalOpcion open={optionModalOpen} onClose={() => setOptionModalOpen(false)} onSelect={(option) => handleSelectOption(option, setFieldValue)} />
            <ModalProblema open={open} onClose={() => setOpen(false)} registro={registroLavadora || registroCalandra} />
            <ModalOpcionEstado
              open={optionModalOpenEstado}
              onClose={() => setOptionModalOpenEstado(false)}
              onSelect={(option) => handleSelectOptionEstado(option, setFieldValue)} // Maneja la selección de la opción
            />
          
          </form>
        )}
      </Formik>


    </Box>
  );
};

export default ReporteSalaLimpia;