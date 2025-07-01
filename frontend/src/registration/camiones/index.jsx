// import { Box, Button, TextField } from "@mui/material";
// import { Formik } from "formik";
// import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import Header from "../../components/Header";
// import { useState, useEffect } from "react";
// import dayjs from "dayjs";
// import { useTheme } from "@emotion/react";
// import { createTruckState } from "../../services/trukSocket.services";
// import LoadingSpinner from "../../loadingSpinner";
// import ModalSucces from "../../modal/modalSucces";
// import ModalCharge from "../../modal/modalCharge";
// import ModalError from "../../modal/modalError";
// import ModalCamion from "../../modal/camiones/modalCamion";
// import io from "socket.io-client";

// const SOCKET_URL = "http://192.168.88.69:4000"; // URL del servidor Socket.IO
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   query: {
//     token: localStorage.getItem("authToken"), // Pasar el token al conectarse
//   },
// });

// const Camiones = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const [registrationError, setRegistrationError] = useState(false);
//   const [isModalCamionOpen, setIsModalCamionOpen] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedCamion, setSelectedCamion] = useState({
//     id: "",
//     model: "",
//     brand: "",
//     chapa: "",
//   });
//   const [initialValues, setInitialValues] = useState({
//     id: "",
//     model: "",
//     brand: "",
//     chapa: "",
//   });

//   const theme = useTheme();
//   const isNonMobile = useMediaQuery("(min-width:600px)");

//   useEffect(() => {
//     setInitialValues((prevValues) => ({
//       ...prevValues,
//       id: selectedCamion.id,
//       model: selectedCamion.model,
//       brand: selectedCamion.brand,
//       chapa: selectedCamion.chapa,
//     }));
//   }, [selectedCamion]);

//   // Effect to reset form fields when registration is successful
//   useEffect(() => {
//     if (registrationSuccess) {
//       setInitialValues({
//         id: "",
//         model: "",
//         brand: "",
//         chapa: "",
//       });
//     }
//   }, [registrationSuccess]);

//   const handleFormSubmit = async (values, { resetForm }) => {
//     setIsLoading(true);

//     const { id, ...valuesId } = values;

//     const valuesToSend = {
//       ...valuesId,
//     };

//     await PostData(valuesToSend);
//   };

//   const PostData = async (valuesToSend) => {
//     try {
//       setTimeout(() => {
//         setIsLoading(false);
//       setRegistrationSuccess(true);

//       }, 3000);
//       const response = await createTruckState(valuesToSend);
//       const responseData = await response;
//       setRegistrationSuccess(true);
//     } catch (error) {
//       console.error("error sending data", error);
//       setRegistrationError(true);
//       setError(error.message);
//     } finally {
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3000);
//     }
//   };

//   const handleCloseModal = () => {
//     setRegistrationSuccess(false);
//   };

//   const handleCloseModalError = () => {
//     setRegistrationError(false);
//   };

//   const handleSelectCamion = (camion) => {
//     setSelectedCamion(camion);
//     setInitialValues({
//       id: camion.id,
//       model: camion.model,
//       brand: camion.brand,
//       chapa: camion.chapa,
//     });
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         event.key === "F9" ||
//         (event.key === "Tab" && document.activeElement.name === "id")
//       ) {
//         setIsModalCamionOpen(true);
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <Box m="20px">
//       <Header
//         title="ENTRADA DE CAMIONES"
//         subtitle="Registro de Entrada de Camiones"
//       />

//       {isLoading && <LoadingSpinner />}
//       {registrationSuccess && (
//         <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
//       )}
//       {registrationError && (
//         <ModalError
//           open={registrationError}
//           onClose={handleCloseModalError}
//           error={error}
//         />
//       )}

//       <Formik
//         onSubmit={handleFormSubmit}
//         initialValues={initialValues}
//         validationSchema={checkoutSchema}
//         enableReinitialize
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleBlur,
//           handleChange,
//           handleSubmit,
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Box
//               display="grid"
//               gap="30px"
//               gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//               sx={{
//                 "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//               }}
//             >
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="ID"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.id}
//                 name="id"
//                 error={!!touched.id && !!errors.id}
//                 helperText={touched.id && errors.id}
//                 sx={{ gridColumn: "span 0" }}
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 onClick={() => setIsModalCamionOpen(true)}
//               />

//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Modelo"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.model}
//                 name="model"
//                 error={!!touched.model && !!errors.model}
//                 helperText={touched.model && errors.model}
//                 sx={{ gridColumn: "span 3" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="Marca"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.brand}
//                 name="brand"
//                 error={!!touched.brand && !!errors.brand}
//                 helperText={touched.brand && errors.brand}
//                 sx={{ gridColumn: "span 0" }}
//               />
//               <TextField
//                 fullWidth
//                 variant="filled"
//                 type="text"
//                 label="CHAPA"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 value={values.chapa}
//                 name="chapa"
//                 error={!!touched.chapa && !!errors.chapa}
//                 helperText={touched.chapa && errors.chapa}
//                 sx={{ gridColumn: "span 3" }}
//               />
//             </Box>
//             <Box display="flex" justifyContent="end" mt="20px">
//               <Button type="submit" color="secondary" variant="contained">
//                 Registrar
//               </Button>
//             </Box>
//           </form>
//         )}
//       </Formik>

//       <ModalCharge isLoading={isLoading} />
//       {/* <ModalCamion
//         open={isModalCamionOpen}
//         onClose={() => setIsModalCamionOpen(false)}
//         onSelectCamion={handleSelectCamion}
//       /> */}
//     </Box>
//   );
// };

// const checkoutSchema = yup.object().shape({
//   id: yup.number().required("required"),
//   model: yup.string().required("required"),
//   brand: yup.string().required("required"),
//   chapa: yup.string().required("required"),
// });

// export default Camiones;
