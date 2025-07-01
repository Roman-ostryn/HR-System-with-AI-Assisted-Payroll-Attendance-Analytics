
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Select, MenuItem, Chip, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalCharge from "../../modal/modalCharge";
import ModalOpcionEstado from "../../modal/estadoProblema/modalOpcion";
import ModalProducto from "../../modal/producto/modalProducto"; // Importación correcta del modal de productos
import { PostReporteStock, getProblemaStock, PostSendGmail } from "../../services/reporteStock.services";
import imageCompression from 'browser-image-compression';
import getApiBaseUrl from "../../utils/getApiBaseUrl";

const ReporteStock = () => {
  const [problemasCalandra, setProblemasCalandra] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProductoOpen, setModalProductoOpen] = useState(false); // Estado para el modal de productos
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const USER = localStorage.getItem('id');

  const fetchProblemas = async () => {
    try {
      const response = await getProblemaStock();
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
    cod_paquete: "",
    cantidad: "",
    serie: "",
    estado_paquete: "",
    cantidad_problema: "",
    imagen: fileBase64,
    obs: "",
    id_usuario: parseInt(USER) || " ",
    id_producto: "",
    problemas: [] // Para almacenar los problemas seleccionados
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const dataToSend = {
      cod_paquete: values.cod_paquete,
      cantidad: values.cantidad,
      serie: values.serie,
      estado_paquete: values.estado_paquete,
      cantidad_problema: values.cantidad_problema,
      imagen: fileBase64,
      id_problema: values.problemas.join(","),
      id_usuario: parseInt(USER),
      id_producto: values.id_producto,
      obs: values.obs,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostReporteStock(dataToSend);
      setRegistrationSuccess(true);
      resetForm();
    } catch (error) {
      // console.error("Error enviando datos:", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendGmail = async (values, { resetForm }) => {
    setIsLoading(true);

    const dataToSend = {
      cod_paquete: values.cod_paquete,
      cantidad: values.cantidad,
      serie: values.serie,
      cantidad_problema: values.cantidad_problema,
      obs: values.obs,
      imagen: fileBase64,
      imagen2: values.imagen2,
      imagen3: values.imagen3,
      id_problema: values.problemas.join(","),
      id_usuario: parseInt(USER),
      id_producto: values.id_producto,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostSendGmail(dataToSend);
      setRegistrationSuccess(true);
      resetForm();
    } catch (error) {
      // console.error("Error enviando datos:", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
          setFileBase64(data.filePath); // Guarda la ruta de la imagen
        } else {
          console.error('Error al subir la imagen');
        }
      } catch (error) {
        console.error("Error al comprimir la imagen:", error);
      }
    }
  };

  const handleFileChange2 = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
          setFieldValue("imagen2", base64String);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error al comprimir la imagen2:", error);
      }
    }
  };
  
  const handleFileChange3 = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
          setFieldValue("imagen3", base64String);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error al comprimir la imagen3:", error);
      }
    }
  };
  

  const openModalProducto = () => {
    setModalProductoOpen(true); // Abrir modal de productos
  };

  const handleSelectProducto = (producto, setFieldValue) => {
    setFieldValue("id_producto", producto.id);
    setFieldValue("cod_paquete", producto.cod);
    setModalProductoOpen(false);
  };
  
  const openOptionModal = () => {
    setModalOpen(true);
  };

  const handleSelectOption = (option, setFieldValue) => {
    setFieldValue("estado_paquete", option);
    setModalOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="Reporte Stock" subtitle="Reporte Stock" />
      {isLoading && <LoadingSpinner />}
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
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Código del Producto"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cod_paquete}
                name="cod_paquete"
                error={!!touched.cod_paquete && !!errors.cod_paquete}
                helperText={touched.cod_paquete && errors.cod_paquete}
                sx={{ gridColumn: "span 2" }}
                onClick={openModalProducto} // Abre el modal de productos al hacer clic
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cantidad de Chapas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cantidad}
                name="cantidad"
                error={!!touched.cantidad && !!errors.cantidad}
                helperText={touched.cantidad && errors.cantidad}
                sx={{ gridColumn: "span 2" }}
              />
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
                label="Cuantas tienen Problemas?"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cantidad_problema}
                name="cantidad_problema"
                error={!!touched.cantidad_problema && !!errors.cantidad_problema}
                helperText={touched.cantidad_problema && errors.cantidad_problema}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Estado Del Problema"
                onBlur={handleBlur}
                onClick={openOptionModal} // Abre el modal para seleccionar el estado del problema
                value={values.estado_paquete}
                name="estado_paquete"
                error={!!touched.estado_paquete && !!errors.estado_paquete}
                helperText={touched.estado_paquete && errors.estado_paquete}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
              />

              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />


              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Observacion"
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
                type="file"
                name="imagenes"
                onChange={(e) => handleImageChange(e, setFieldValue)}
                sx={{ gridColumn: "span 2" }}
              />

{/*               
              <TextField
                fullWidth
                variant="filled"
                type="file"
                onChange={(e) => handleFileChange(e, setFieldValue)}
                sx={{
                  gridColumn: "span 2",
                  display: "none", // Ocultamos el campo TextField
                }}
                id="file-upload" // ID para el input de archivo
              /> */}

              {/* <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  color="secondary"
                  component="span"
                  sx={{
                    gridColumn: "span 2",
                    display: "flex",  // Usamos flex para que el botón se vea bien en su lugar
                    justifyContent: "center", // Centrado de texto en el botón
                    padding: "8px 16px", // Padding para un tamaño más agradable
                    fontWeight: "bold", // Establecemos un texto en negrita
                  }}
                >
                  Subir Imagen
                </Button>
              </label> */}

              {/* <TextField
                fullWidth
                variant="filled"
                type="file"
                onChange={(e) => handleFileChange2(e, setFieldValue)}
                sx={{ gridColumn: "span 2" }}
                label="Imagen 2"
              />

              <TextField
                fullWidth
                variant="filled"
                type="file"
                onChange={(e) => handleFileChange3(e, setFieldValue)}
                sx={{ gridColumn: "span 2" }}
                label="Imagen 3"
              /> */}

            </Box>

            <Box display="flex" justifyContent="space-between" mt="20px" gap="10px">
              <Button
                color="secondary"
                variant="contained"
                sx={{
                  background: "#cedc00",
                }}
                onClick={(e) => {
                  e.preventDefault(); // Previene el submit del formulario
                  sendGmail(values, { resetForm }); // Llama a la función para enviar el correo
                }}
              >
                REPORTE RECLAMO
              </Button>

              <Button
                color="secondary"
                variant="contained"
                onClick={(e) => {
                  e.preventDefault(); // Previene el submit del formulario
                  handleFormSubmit(values, { resetForm }); // Llama a la función para enviar el reporte interno
                }}
              >
                REPORTE INTERNO
              </Button>
            </Box>
            <ModalCharge isLoading={isLoading} />
            <ModalOpcionEstado
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSelect={(option) => handleSelectOption(option, setFieldValue)}
            />

            <ModalProducto
              open={modalProductoOpen} // Estado del modal de productos
              serviceType={0}
              onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
              onSelectProduct={(producto) => handleSelectProducto(producto, setFieldValue)}// Lógica para seleccionar productos
            />
          </form>
          
        )}
      </Formik>
      
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  cod_paquete: yup.string().required("Campo requerido"),
  cantidad: yup.number().required("Campo requerido"),
  serie: yup.string().required("Campo requerido"),
  estado_paquete: yup.string().required("Campo requerido"),
  cantidad_problema: yup.number().required("Campo requerido"),
});

export default ReporteStock;
