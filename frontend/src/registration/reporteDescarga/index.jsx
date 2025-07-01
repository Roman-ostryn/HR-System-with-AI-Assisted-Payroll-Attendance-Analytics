import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
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
import ModalProblemaDescarga from "../../modal/problemaDescarga/modalDescarga";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { PostReporteDescarga } from "../../services/reporteDescarga.services";
import imageCompression from 'browser-image-compression';
import { io } from "socket.io-client"; // Importa la librería de Socket.IO
import getUrlSocket from '../../utils/getUrlSocket'; // Asegúrate de que esta función esté definida correctamentege
import getApiBaseUrl from "../../utils/getApiBaseUrl";

const ReporteDescarga = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Establecer conexión con el servidor de Socket.IO
  const socket = io(getUrlSocket()); // Ajusta la URL según sea necesario

  useEffect(() => {
    // Escucha de eventos de problemas actualizados en el servidor
    socket.on("problemaActualizado", (data) => {
      // Aquí podrías manejar el problema recibido, por ejemplo, mostrando una notificación.
    });

    // Limpiar la conexión de Socket.IO al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const initialValues = {
    id_problemadescarga: "",
    Descripcion: "",
    obs: "",
    codigo_paquete: "",
    imagenes: "",
  };

  const handleFileChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
          setFileBase64(base64String);
          setFieldValue("archivo_base64", base64String);
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error al comprimir la imagen:", error);
      }
    }
  };

  const openModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  const handleSelectDescarga = (descarga, setFieldValue) => {
    if (selectedField === "id_problemadescarga") {
      setFieldValue("id_problemadescarga", descarga.id);
      setFieldValue("Descripcion", descarga.Descripcion);
    }
    setModalOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const dataToSend = {
      id_problemadescarga: values.id_problemadescarga,
      obs: values.obs,
      codigo_paquete: values.codigo_paquete,
      imagenes: fileBase64,
    };

    try {
      const response = await PostReporteDescarga(dataToSend);

      // Emitir evento a través de Socket.IO para notificar a otros sectores
      socket.emit("reporteProblema", {
        sector: "descarga",
        problema: {
          id: values.id_problemadescarga,
          descripcion: values.Descripcion,
          observacion: values.obs,
          codigo_paquete: values.codigo_paquete,
          imagen: fileBase64,
        },
      });

      setRegistrationSuccess(true);
      resetForm();
    } catch (error) {
      console.error("Error enviando datos:", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Reporte Descarga" subtitle="Reporte Descarga" />

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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Problema Detectado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_problemadescarga}
                name="id_problemadescarga"
                error={!!touched.id_problemadescarga && !!errors.id_problemadescarga}
                helperText={touched.id_problemadescarga && errors.id_problemadescarga}
                sx={{ gridColumn: "span 2" }}
                InputProps={{ readOnly: true }}
                onClick={() => openModal("id_problemadescarga")}
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
                label="Código del Paquete"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.codigo_paquete}
                name="codigo_paquete"
                error={!!touched.codigo_paquete && !!errors.codigo_paquete}
                helperText={touched.codigo_paquete && errors.codigo_paquete}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="file"
                label="Subir Archivo"
                name="archivo"
                onChange={(e) => handleFileChange(e, setFieldValue)}
                sx={{ gridColumn: "span 2" }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Reportar
              </Button>
            </Box>
            <ModalCharge isLoading={isLoading} />

            <ModalProblemaDescarga
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSelect={(descarga) => handleSelectDescarga(descarga, setFieldValue)}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_problemadescarga: yup.string().required("Requerido"),
  obs: yup.string(),
  codigo_paquete: yup.string(),
  imagenes: yup.string(),
});

export default ReporteDescarga;
