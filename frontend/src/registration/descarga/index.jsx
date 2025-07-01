// import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import Header from "../../components/Header";
// import { Box, Button, TextField, Grid, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
// import { getOne, putInter } from '../../services/stock.services';
// import ModalCaballete from '../../modal/caballete/modalCaballete';
// import ModalSucces from "../../modal/modalSucces";
// import ModalError from "../../modal/modalError";
// import ModalCharge from "../../modal/modalCharge";
// import { getOneDatosCaballete } from '../../services/caballete.services';

// const validationSchema = yup.object({
//   id_caballete: yup.string().required('Caballete es requerido'),
//   cod_interno: yup.string().required('Paquete es requerido'),
// });

// const MyForm = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const [registrationError, setRegistrationError] = useState(false);
//   const [error, setError] = useState("");
//   const [data, setData] = useState(null);
//   const theme = useTheme();
//   const isNonMobile = useMediaQuery("(min-width:600px)");
//   const [modalOpen, setModalOpen] = useState(false);
//   const USER = localStorage.getItem('id');
//   const EMPRESA = localStorage.getItem('cod_empresa') || 1;

//   useEffect(() => {
//   if (!formik.values.id_caballete) return;

//   const timer = setTimeout(async () => {
//     try {
//       const result = await getOneDatosCaballete(formik.values.id_caballete);
//       if (result) {
//         formik.setFieldValue("descripcion", result.descripcion || "");
//       }
//     } catch (error) {
//       console.error("Error obteniendo datos del caballete:", error);
//     }
//   }, 1000); // espera 1 segundo

//   return () => clearTimeout(timer); // limpia el timeout si el valor cambia
// }, [formik.values.id_caballete]);

//   const formik = useFormik({
//     initialValues: {
//       id: '',
//       id_caballete: '',
//       descripcion: '',
//       cod_interno: '',
//     },
//     validationSchema,
//     onSubmit: async (values, { setFieldValue }) => {

//       setIsLoading(true);
//       const { id_caballete, cod_interno } = values;

//       try {
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//         const result = await getOne(cod_interno);
//         if (!result) {
//           throw new Error('No se encontraron datos para el código interno proporcionado.');
//         }
//         setData(result);

//         if (result.id_caballete === id_caballete) {
//           throw new Error(`El paquete ${result.cod_interno} ya se encuentra en este caballete`);
//         }

//         const valuesToSend = {
//           id: result.id,
//           caballete_origen: result.id_caballete,
//           id_usuario: USER,
//           cod_empresa: 1,
//           id_caballete,
//         };

//         await putInter(result.id, valuesToSend);
//         setRegistrationSuccess(true);
//         setFieldValue('cod_interno', '');
//       } catch (error) {
//         setRegistrationError(true);
//         setError(error.message);
//       } finally {
//         setTimeout(() => {
//           setIsLoading(false);
//         }, 3000);
//       }
//     },
//   });

//   useEffect(() => {
//   if (!formik.values.id_caballete) return;

//   const timer = setTimeout(async () => {
//     try {
//       const result = await getOneDatosCaballete(formik.values.id_caballete);
//       if (result) {
//         formik.setFieldValue("descripcion", result.descripcion || "");
//       }
//     } catch (error) {
//       console.error("Error obteniendo datos del caballete:", error);
//     }
//   }, 1000); // espera 1 segundo

//   return () => clearTimeout(timer); // limpia el timeout si el valor cambia
// }, [formik.values.id_caballete]);

//   return (
//     <Box m="20px">
//       <Header title="Translado de Producto" subtitle="Transladar Paquete" />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           padding: theme.spacing(2),
//           [theme.breakpoints.down('sm')]: {
//             padding: theme.spacing(1),
//           },
//         }}
//       >
//         <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 label="ID Caballete"
//                 value={formik.values.id_caballete}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.id_caballete && Boolean(formik.errors.id_caballete)}
//                 helperText={formik.touched.id_caballete && formik.errors.id_caballete}
//                 onClick={() => setModalOpen(true)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 label="Caballete"
//                 value={formik.values.descripcion}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
//                 helperText={formik.touched.descripcion && formik.errors.descripcion}
//                 onClick={() => setModalOpen(true)}
//                  InputProps={{ readOnly: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 label="Paquete"
//                 name="cod_interno"
//                 value={formik.values.cod_interno}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.cod_interno && Boolean(formik.errors.cod_interno)}
//                 helperText={formik.touched.cod_interno && formik.errors.cod_interno}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="end" mt="-3vh">
//                 <Button type="submit" color="secondary" variant="contained" sx={{
//                   background: "#cedc00",
//                   marginBottom: "5vh",
//                   height: "6vh",
//                   width: isNonMobile ? 'auto' : '100%',
//                   marginTop: "2vh"
//                 }}>
//                   Transladar
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Box>

//       {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
//       {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={error} />}
//       <ModalCharge isLoading={isLoading} />
//       <ModalCaballete
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSelect={(data) => {
//           formik.setFieldValue("descripcion", data.descripcion);
//           formik.setFieldValue("id_caballete", data.id);
//           setModalOpen(false);
//         }}
//       />
//     </Box>
//   );
// };

// export default MyForm;

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import {
  Box,
  Button,
  TextField,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getOne, putInter } from "../../services/stock.services";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalCharge from "../../modal/modalCharge";
import { getOneDatosCaballete } from "../../services/caballete.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = yup.object({
  id_caballete: yup.string().required("Caballete es requerido"),
  cod_interno: yup.string().required("Paquete es requerido"),
});

const MyForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [modalOpen, setModalOpen] = useState(false);
  const USER = localStorage.getItem("id");
  const EMPRESA = localStorage.getItem("cod_empresa") || 1;

  const formik = useFormik({
    initialValues: {
      id: "",
      id_caballete: "",
      descripcion: "",
      cod_interno: "",
    },
    validationSchema,
    onSubmit: async (values, { setFieldValue }) => {
      setIsLoading(true);
      const { id_caballete, cod_interno } = values;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = await getOne(cod_interno);

        if (!result) {
          throw new Error(
            "No se encontraron datos para el código interno proporcionado."
          );
        }
        setData(result);

        if (result.id_caballete === parseInt(id_caballete)) {
          throw new Error(
            `El paquete ${result.cod_interno} ya se encuentra en este caballete`
          );
        }

        
        const valuesToSend = {
          id: result.id,
          caballete_origen: result.id_caballete,
          id_usuario: USER,
          cod_empresa: 1,
          id_caballete,
        };

        await putInter(result.id, valuesToSend);
        toast.success(
          `Translado exitoso del paquete ${result.cod_interno} a ${values.descripcion}`,
          {
            position: "top-center",
            autoClose: 9000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        setFieldValue("cod_interno", "");
      } catch (error) {
        setRegistrationError(true);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    },
  });

  // 👇 Ejecuta getOneDatosCaballete 1 segundo después de cambiar id_caballete
  useEffect(() => {
    if (!formik.values.id_caballete) return;

    const timer = setTimeout(async () => {
      try {
        const result = await getOneDatosCaballete(formik.values.id_caballete);
        if (result) {
          formik.setFieldValue("descripcion", result.descripcion || "");
        }
      } catch (error) {
        toast.error(
          `El caballete ${formik.values.id_caballete} no existe, intentente nuevamente`,
          {
            position: "top-center",
            autoClose: 9000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        formik.setFieldValue("descripcion", "");
        formik.setFieldValue("id_caballete", "");
      }
    }, 1000); // espera 1 segundo

    return () => clearTimeout(timer); // limpia si el valor cambia antes de 1 segundo
  }, [formik.values.id_caballete]);

  return (
    <Box m="20px">
      <Header title="Translado de Producto" subtitle="Transladar Paquete" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: theme.spacing(2),
          [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
          },
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="ID Caballete"
                name="id_caballete"
                value={formik.values.id_caballete}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.id_caballete &&
                  Boolean(formik.errors.id_caballete)
                }
                helperText={
                  formik.touched.id_caballete && formik.errors.id_caballete
                }
                // onClick={() => setModalOpen(true)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Caballete"
                name="descripcion"
                value={formik.values.descripcion}
                InputProps={{ readOnly: true }}
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
                error={
                  formik.touched.cod_interno &&
                  Boolean(formik.errors.cod_interno)
                }
                helperText={
                  formik.touched.cod_interno && formik.errors.cod_interno
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="end" mt="-3vh">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{
                    background: "#cedc00",
                    marginBottom: "5vh",
                    height: "6vh",
                    width: isNonMobile ? "auto" : "100%",
                    marginTop: "2vh",
                  }}
                >
                  Transladar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      {registrationSuccess && (
        <ModalSucces
          open={registrationSuccess}
          onClose={() => setRegistrationSuccess(false)}
        />
      )}
      {registrationError && (
        <ModalError
          open={registrationError}
          onClose={() => setRegistrationError(false)}
          error={error}
        />
      )}
      <ModalCharge isLoading={isLoading} />
      <ModalCaballete
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(data) => {
          formik.setFieldValue("descripcion", data.descripcion);
          formik.setFieldValue("id_caballete", data.id);
          setModalOpen(false);
        }}
      />
    </Box>
  );
};

export default MyForm;
