import React, { useState, useEffect } from "react";
import { Box, Button, TextField, FormControl, Select, Chip, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
// import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalCharge from "../../modal/modalCharge";
import ModalProducto from "../../modal/producto/modalProducto"; 
import ModalOpcion from "../../modal/problemaLavadora/modalOpcion"; 
import ModalOpcionEstado from "../../modal/estadoProblema/modalOpcion";
import { PostReporteLavadora, getProblemaLavadora } from "../../services/reporteLavadora.services";
import { getOneDatos, getProblemaStock } from "../../services/reporteStock.services";
import imageCompression from 'browser-image-compression';
import ModalProblemaCalandra from "../../modal/problemaCalandra/modaCalandra";
import getApiBaseUrl from "../../utils/getApiBaseUrl";
import io from 'socket.io-client';
import getUrlSocket from "../../utils/getUrlSocket";


const ReporteLavadora = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [problemasCalandra, setProblemasCalandra] = useState([]);
  const [optionModalOpen, setOptionModalOpen] = useState(false); 
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [optionModalOpenEstado, setOptionModalOpenEstado] = useState(false); 
  const [selectedField, setSelectedField] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  // const [producto, setProducto] = useState(""); 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  
  const USER = localStorage.getItem('id');
  const socket = io(getUrlSocket(), {
    transports: ['websocket', 'polling'] // Asegúrate de incluir ambos transportes
  });
  

  // const handleRegistroLavadora = (datosRegistro) => {
  //   // Envía los datos del registro de lavadora al servidor mediante Socket.IO
  //   socket.emit('registro_lavadora', {datos: datosRegistro});
  // };
  
  useEffect(() => {
    fetchProblemas();
  }, []);

  const fetchProblemas = async () => {
    try {
      const response = await getProblemaLavadora();
      setProblemasCalandra(response);
    } catch (error) {
      console.error("Error al obtener problemas:", error);
      setError("Error al obtener problemas");
    }
  };
// setIsLoading(true)
  const initialValues = {
    id_problema: "",
    problemas: [],
    descripcion_problema: "",
    descripcion_producto: "",
    obs: "",
    codigo_paquete: "",
    problemaanterior: "",
    descripcion: "",
    imagenes: fileBase64 || "",
    id_usuario: parseInt(USER),
    estado_paquete: "",
    orden_produccion:"",
    producto:"",
    cantidad_problema:"1",
  };

  

  const handleCodigoPaqueteChange = async (e, setFieldValue) => {
    const codigo = e.target.value;
    
    setFieldValue("codigo_paquete", codigo);

    if (codigo) {
      try {

        const response = await getOneDatos(codigo);
        
        if (response) {
          const problemasArray = response.id_problema.split(',').map(item => item.trim());
          setFieldValue("estado_paquete", response.estado_paquete);
          setFieldValue("descripcion_producto", response.cod_paquete); 
          // setFieldValue("problema", response.id_problema);
          setFieldValue("id_producto", response.id_producto);
          setFieldValue("cantidad_problema", response.cantidad_problema);
          setFieldValue("descripcion_problema", response.id_problema);
          setFieldValue("problemas", problemasArray);
          setFieldValue("problemaanterior", "SI");
          
        }
      } catch (error) {
        console.error("Error al obtener los datos del paquete:", error);
        setError(error.message);
      }
    }
  };


  const handleFormSubmit = async (values, { resetForm }) => {

    setIsLoading(true);

    const dataToSend = {
      serie_stock: values.codigo_paquete,
      obs: values.obs,
      id_problema: values.problemas.join(",") ,
      problemaanterior: values.problemaanterior,
      estado_problema: values.estado_paquete,
      imagenes:  fileBase64 ,
      id_usuario: parseInt(USER),
      orden_produccion: values.orden_produccion,
      id_producto: values.id_producto,
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostReporteLavadora(dataToSend); 
      setRegistrationSuccess(true);
      resetForm();
    } catch (error) {
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
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
        console.error('Error al comprimir la imagen:', error);
      }
    }
  };

  // const handleFileChange = async (e, setFieldValue) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     try {
  //       const options = {
  //         maxSizeMB: 1,
  //         maxWidthOrHeight: 1920,
  //         useWebWorker: true,
  //       };
  //       const compressedFile = await imageCompression(file, options);
  //       const reader = new FileReader();

  //       reader.onloadend = () => {
  //         const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
  //         setFileBase64(base64String);
  //         setFieldValue("archivo_base64", base64String);
  //       };

  //       reader.readAsDataURL(compressedFile);
  //     } catch (error) {
  //       console.error("Error al comprimir la imagen:", error);
  //     }
  //   }
  // };

  const openModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  const openModalProducto = () => {
    setModalProductoOpen(true); // Abrir modal de productos
  };

  const handleSelectStock = async (stock, setFieldValue) => {
    if (selectedField === "id_problema") {
      setFieldValue("id_problema", stock.id);
      setFieldValue("descripcion_problema", stock.descripcion);
    }
    setModalOpen(false);
  };

  const handleSelectProducto = (producto, setFieldValue) => {
    setFieldValue("id_producto", producto.id);
    setFieldValue("descripcion_producto", producto.cod); // Asigna el código del paquete
    setModalProductoOpen(false); // Cerrar el modal de productos
  };

  const openOptionModalEstado = () => {
    setOptionModalOpenEstado(true);
  };

  const handleSelectOptionEstado = (option, setFieldValue) => {
    setFieldValue("estado_paquete", option); // Actualiza el valor del campo
    setOptionModalOpenEstado(false); // Cierra el modal después de la selección
  };

  return (
    <Box m="20px">
      <Header title="Reporte Lavadora" subtitle="Reporte Lavadora" />

      {/* {isLoading && <ModalCharge />} */}
      {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
      {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={error} />}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Orden de Produccion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.orden_produccion}
                name="orden_produccion"
                error={!!touched.orden_produccion && !!errors.orden_produccion}
                helperText={touched.orden_produccion && errors.orden_produccion}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Código del Paquete"
                onBlur={handleBlur}
                onChange={(e) => handleCodigoPaqueteChange(e, setFieldValue)}
                value={values.codigo_paquete}
                name="codigo_paquete"
                error={!!touched.codigo_paquete && !!errors.codigo_paquete}
                helperText={touched.codigo_paquete && errors.codigo_paquete}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Producto a procesar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion_producto}
                name="descripcion_producto"
                error={!!touched.descripcion_producto && !!errors.descripcion_producto}
                helperText={touched.descripcion_producto && errors.descripcion_producto}
                sx={{ gridColumn: "span 2" }}
                onClick={openModalProducto} // Abre el modal de productos al hacer clic
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
                label="Cantidad con Problemas"
                onBlur={handleBlur}
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
                onChange={handleChange}
                value={values.estado_paquete}
                name="estado_paquete"
                error={!!touched.estado_paquete && !!errors.estado_paquete}
                helperText={touched.estado_paquete && errors.estado_paquete}
                sx={{ gridColumn: "span 2" }}
                onClick={openOptionModalEstado}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="¿Llegó con Problemas?"
                onBlur={handleBlur}
                onClick={() => setOptionModalOpen(true)}
                value={values.problemaanterior}
                name="problemaanterior"
                error={!!touched.problemaanterior && !!errors.problemaanterior}
                helperText={touched.problemaanterior && errors.problemaanterior}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="-3vh">
              <Button type="submit" color="secondary" variant="contained" sx={{background:"#cedc00",
                marginBottom:"5vh",
                height:"6vh",
                width:"10vw",
                marginTop:"-2vh"
                
              }}>
                Reportar
              </Button>
            </Box>
            <ModalCharge isLoading={isLoading} />
            <ModalProblemaCalandra
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSelect={(stock) => handleSelectStock(stock, setFieldValue)}
            />
            <ModalOpcionEstado
              open={optionModalOpenEstado}
              onClose={() => setOptionModalOpenEstado(false)}
              onSelect={(option) => handleSelectOptionEstado(option, setFieldValue)} // Maneja la selección de la opción
            />
            <ModalOpcion
              open={optionModalOpen}
              onClose={() => setOptionModalOpen(false)}
              onSelect={(option) => setFieldValue("problemaanterior", option)}
            />
            <ModalProducto
              open={modalProductoOpen} // Estado del modal de productos
              onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
              onSelectProduct={(producto) => handleSelectProducto(producto, setFieldValue)}// Lógica para seleccionar productos
              // sector="lavadora"
              serviceType={0}
            />
            
          </form>
          
        )}
      </Formik>
    </Box>
  );
};
const checkoutSchema = yup.object().shape({
  // descripcion_problema: yup.string().required("Requerido"),
  obs: yup.string(),
  codigo_paquete: yup.string().required("Requerido"), 
  problemaanterior: yup.string().required("Requerido"),
  id_producto: yup.string(),
  orden_produccion: yup.string(),
  // imagenes: yup.string().required("Imagen Requerida")
});

export default ReporteLavadora;
