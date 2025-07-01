
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import ModalOpcionEstado from "../../modal/estadoProblema/modalOpcion";
import ModalProducto from "../../modal/producto/modalProducto";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalOpcion from "../../modal/problemaLavadora/modalOpcion"; 

import io from 'socket.io-client';
import { tokens } from "../../theme";
import { PostReporteLavadora } from "../../services/reporteLavadora.services";
import { getOneDatos } from "../../services/reporteStock.services";
import { getProblemaCalandra} from "../../services/reporteCalandra.services";
import Header from "../../components/Header";


const ReporteLavadora = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [optionModalOpen, setOptionModalOpen] = useState(false); 
  const [optionModalOpenEstado, setOptionModalOpenEstado] = useState(false);
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [problemasCalandra, setProblemasCalandra] = useState([]);
  const [error, setError] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const USER = localStorage.getItem('id');
  const socket = io(getUrlSocket(), {
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    fetchProblemas();
  }, []);

  const fetchProblemas = async () => {
    try {
      const response = await getProblemaCalandra();
      setProblemasCalandra(response);
    } catch (error) {
      console.error("Error al obtener problemas:", error);
      setError("Error al obtener problemas");
    }
  };

  const initialValues = {
    orden_produccion: "",
    codigo_paquete: "",
    descripcion_producto: "",
    estado_paquete: "",
    obs: "",
    cantidad_problema: "1",
    id_usuario: parseInt(USER),
    id_producto: "",
    problemaanterior: "",
    problemas: [] // Para almacenar problemas seleccionados
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const dataToSend = {
      orden_produccion: values.orden_produccion,
      codigo_paquete: values.codigo_paquete,
      obs: values.obs,
      estado_paquete: values.estado_paquete,
      id_usuario: parseInt(USER),
      id_producto: values.id_producto,
      problemas: values.problemas.join(",") // Concatenar valores seleccionados
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
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
          setFileBase64(base64String);
          setFieldValue("archivo_base64", base64String);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error al comprimir la imagen:", error);
      }
    }
  };

  const openModalProducto = () => {
    setModalProductoOpen(true);
  };

  const handleSelectProducto = (producto, setFieldValue) => {
    setFieldValue("id_producto", producto.id);
    setFieldValue("descripcion_producto", producto.cod);
    setModalProductoOpen(false);
  };

  const openOptionModalEstado = () => {
    setOptionModalOpenEstado(true);
  };

  const handleSelectOptionEstado = (option, setFieldValue) => {
    setFieldValue("estado_paquete", option);
    setOptionModalOpenEstado(false);
  };

  return (
    <Box m="20px">
      <Header title="Reporte Lavadora" subtitle="Reporte Lavadora" />
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
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Orden de Producción"
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
                type="text"
                label="Producto"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion_producto}
                name="descripcion_producto"
                error={!!touched.descripcion_producto && !!errors.descripcion_producto}
                helperText={touched.descripcion_producto && errors.descripcion_producto}
                sx={{ gridColumn: "span 2" }}
                onClick={openModalProducto}
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
                onChange={(e) => handleFileChange(e, setFieldValue)}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Enviar
              </Button>
            </Box>
            {/* Modales para Producto y Estado */}
            <ModalProducto
              open={modalProductoOpen} // Estado del modal de productos
              onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
              onSelectProducto={(producto) => handleSelectProducto(producto, setFieldValue)}// Lógica para seleccionar productos
              sector="lavadora"
            />
             <ModalOpcion
              open={optionModalOpen}
              onClose={() => setOptionModalOpen(false)}
              onSelect={(option) => setFieldValue("problemaanterior", option)}
            />
            <ModalOpcionEstado
              open={optionModalOpenEstado}
              onClose={() => setOptionModalOpenEstado(false)}
              onSelect={(estado) => handleSelectOptionEstado(estado, setFieldValue)}
            />
          </form>

        )}
      </Formik>

      
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  orden_produccion: yup.string().required("Campo requerido"),
  codigo_paquete: yup.string().required("Campo requerido"),
  descripcion_producto: yup.string().required("Campo requerido"),
  estado_paquete: yup.string().required("Campo requerido"),
  cantidad_problema: yup.number().required("Campo requerido")
});

export default ReporteLavadora;
