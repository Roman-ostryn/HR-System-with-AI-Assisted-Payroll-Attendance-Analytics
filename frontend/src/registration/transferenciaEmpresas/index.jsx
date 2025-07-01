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

const validationSchema = yup.object({
  cod_empresa: yup.string().required('Caballete es requerido'),
  cod_interno: yup.string().required('Paquete es requerido'),
}); 

const Transferencia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null); // Estado para almacenar los datos obtenidos
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [modalOpen, setModalOpen] = useState(false);


  const formik = useFormik({
    initialValues: {
      id: '',
      cod_empresa: '',
      descripcion: '',
      cod_interno: '',
    },
    validationSchema,
    onSubmit: async (values, { setFieldValue }) => {
      setIsLoading(true);
      const { cod_empresa} = values;
      const valuesToSend = {
        id: data.id,
        cod_empresa,
      };

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await putEmpresa(data.id, valuesToSend);
        setRegistrationSuccess(true);
        setFieldValue('cod_interno', '');
      } catch (error) {
        setRegistrationError(true);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (formik.values.cod_interno) {
        try {
          const result = await getOne(formik.values.cod_interno);
          setData(result); // Guarda los datos obtenidos en el estado
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      }
    };
    fetchData();
  }, [formik.values.cod_interno]); // Ejecuta el efecto cada vez que cambia el valor de cod_interno

  return (
    <Box m="20px">
      <Header title="Transferencia a otra Empresas" subtitle="Transladar Paquete" />
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
              label="Empresa destino" 
              name="cod_empresa"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cod_empresa && Boolean(formik.errors.cod_empresa)}
              helperText={formik.touched.cod_empresa && formik.errors.cod_empresa}
              onClick={() => setModalOpen(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Paquete"
              name="cod_interno"
              value={formik.values.cod_interno}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cod_interno && Boolean(formik.errors.cod_interno)}
              helperText={formik.touched.cod_interno && formik.errors.cod_interno}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="end" mt="-3vh">
              <Button type="submit" color="secondary" variant="contained" sx={{background:"#cedc00",
                marginBottom:"5vh",
                height:"6vh",
                width: isNonMobile ? 'auto' : '100%',
                marginTop:"2vh"
              }}>
                Transladar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
      {/* {isLoading && <ModalCharge />} */}
      {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
      {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={error} />}

      <ModalCharge isLoading={isLoading} />
      <ModalEmpresa
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectEmpresa={(data) => {
          // Actualizar los valores del usuario seleccionado
          formik.setFieldValue("descripcion", data.nombre);
          formik.setFieldValue("cod_empresa", data.id);
          setModalOpen(false);
        }}
      />
    </Box>
  </Box>

  );
};

export default Transferencia;