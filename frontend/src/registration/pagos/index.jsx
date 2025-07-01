import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { PostDatosGrupos } from "../../services/grupos.services";
import ModalHorario from "../../modal/horarios/modalHorarios";
import ModalCharge from "../../modal/modalCharge";
import { PostDatosPagos } from "../../services/pagos.services";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import ModalUserData from "../../modal/user/modalUserData";


const Pagos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
      id_usuario: "",
      salario_pagado: "",
      // descuento: "",
      // cedula: "",
      // dias: "",
      // estado:  "",
      mes:"",
      salario_real:"",
      salario_ips:"",
  });
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { salario_pagado, salario_real, salario_ips } = values;
    const salario = salario_pagado.trim().replace(/\./g, ""); 
    // const descuent = descuento.trim().replace(/\./g, ""); 
     const sreal = salario_real.trim().replace(/\./g, ""); 
     const sips = salario_ips.trim().replace(/\./g, ""); 
    const valuesToSend = {
      ...values,
      salario_pagado:salario,
      // descuento:descuent,
      salario_real: sreal,
      salario_ips:sips

    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
       const response = await PostDatosPagos(valuesToSend);
      setRegistrationSuccess(true);
      // resetForm();
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

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  return (
    <Box m="20px">
      <Header title="Registro Pagos" subtitle="Registro de Pagos" />

      {isLoading && <LoadingSpinner />}
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
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
                label="Id_Usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_usuario || ""}
                name="id_usuario"
                error={!!touched.id_usuario && !!errors.id_usuario}
                helperText={touched.id_usuario && errors.id_usuario}
                sx={{ gridColumn: "span 1" }}
                onClick={() => setIsModalOpen(true)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salario Ips"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salario_ips || ""}
                name="salario_ips"
                error={!!touched.salario_ips && !!errors.salario_ips}
                helperText={touched.salario_ips && errors.salario_ips}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salario Real"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salario_real || ""}
                name="salario_real"
                error={!!touched.salario_real && !!errors.salario_real}
                helperText={touched.salario_real && errors.salario_real}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salario Pagado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salario_pagado || ""}
                name="salario_pagado"
                error={!!touched.salario_pagado && !!errors.salario_pagado}
                helperText={touched.salario_pagado && errors.salario_pagado}
                sx={{ gridColumn: "span 1" }}
              />
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Seleccione un Valor
                  </InputLabel>
                  <NativeSelect
                    inputProps={{
                      name: "mes",
                      id: "uncontrolled-native",
                    }}
                    value={values.mes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.mes && !!errors.mes}
                  >
                    <option value=""></option>
                    <option value="Enero">Enero</option>
                    <option value="Febrero">Febrero</option>
                    <option value="Marzo">Marzo</option>
                    <option value="Abril">Abril</option>
                    <option value="Mayo">Mayo</option>
                    <option value="Junio">Junio</option>
                    <option value="Julio">Julio</option>
                    <option value="Agosto">Agosto</option>
                    <option value="Septiembre">Septiembre</option>
                    <option value="Octubre">Octubre</option>
                    <option value="Noviembre">Noviembre</option>
                    <option value="Diciembre">Diciembre</option>
                  </NativeSelect>
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>
            {isModalOpen && (
              <ModalUserData
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectUsuario={(usuario) => {
                  setFieldValue("id_usuario", usuario.id); // Asigna el id del salario al campo id_salario
                  setIsModalOpen(false);
                }}
              />
            )}
            <ModalCharge isLoading={isLoading} />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_usuario: yup.number().required("Este Campo es Requerida"),
  salario_pagado: yup.string().required("Este Campo es Requerida"),
  mes: yup.string().required("Este Campo es Requerida"),
  salario_real: yup.string().required("Este Campo es Requerida"),
  salario_ips: yup.string().required("Este Campo es Requerida"),
});

export default Pagos;