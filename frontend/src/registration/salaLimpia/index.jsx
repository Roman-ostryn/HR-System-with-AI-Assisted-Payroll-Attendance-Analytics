import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Header from "../../components/Header";
import { Box, Button, TextField, Grid, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { getOne, putEmpresa } from '../../services/stock.services'; // Asegúrate de importar tu función PostDatos
import ModalEmpresa from '../../modal/empresas/modalEmpresas';
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalCharge from "../../modal/modalCharge";
import SaveIcon from '@mui/icons-material/Save';
import { PostDatosSala } from '../../services/salaLimpia.services';

const validationSchema = yup.object({
  humedad_int: yup.string().required('Humedad es requerido'),
  temp_interna: yup.string().required('Temperatura es requerido'),
}); 

const SalaLimpiaT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null); // Estado para almacenar los datos obtenidos
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [modalOpen, setModalOpen] = useState(false);
  const USER = localStorage.getItem('id');
  const Cod_empresa = localStorage.getItem('cod_empresa') || 1;


  const initialValues = {
    humedad_int: '',
    temp_interna: '', 
  }

  const formik = useFormik({
    initialValues: {
      humedad_int: '',
      temp_interna: '',

     
    },
    validationSchema,
    onSubmit: async (values, { setFieldValue, resetForm }) => {
      setIsLoading(true);
      // const { cod_empresa} = values;
      const valuesToSend = {
        humedad_int: `${values.humedad_int}%`,
        temp_interna: `${values.temp_interna}°`,
        id_usuario: parseInt(USER),
        cod_empresa: parseInt(Cod_empresa) || 1,
        // cod_empresa,
        // setFieldValue(initialValues)
      };

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await PostDatosSala(valuesToSend);
        setRegistrationSuccess(true);
        resetForm();
        setFieldValue(initialValues)
      } catch (error) {
        setRegistrationError(true);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });


  return (
    <Box m="20px">
      <Header title="Registro de Ambiente" subtitle="Registro de Temperaturas" />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
          padding: theme.spacing(1),
        },
      }}
    >
      <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Humedad" 
              name="humedad_int"
              value={formik.values.humedad_int}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.humedad_int && Boolean(formik.errors.humedad_int)}
              helperText={formik.touched.humedad_int && formik.errors.humedad_int}
              onClick={() => setModalOpen(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Temperatura"
              name="temp_interna"
              value={formik.values.temp_interna}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.temp_interna && Boolean(formik.errors.temp_interna)}
              helperText={formik.touched.temp_interna && formik.errors.temp_interna}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="end" mt="-3vh">
              <Button type="submit" color="secondary" variant="contained" sx={{background:"#cedc00",
                marginBottom:"5vh",
                height:"6vh",
                width: isNonMobile ? 'auto' : '100%',
                marginTop:"3vh"
              }}
              startIcon={<SaveIcon/>}
              >
                Registrar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      {/* {isLoading && <ModalCharge />} */}
      {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
      {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={error} />}

      <ModalCharge isLoading={isLoading} />
      {/* <ModalEmpresa
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectEmpresa={(data) => {
          // Actualizar los valores del usuario seleccionado
          formik.setFieldValue("descripcion", data.nombre);
          formik.setFieldValue("cod_empresa", data.id);
          setModalOpen(false);
        }}
      /> */}
    </Box>
  </Box>

  );
};

export default SalaLimpiaT;