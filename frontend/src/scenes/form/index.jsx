import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalSalario from "../../modal/salarios/modalSalarios";
import ModalPermisos from "../../modal/camiones/modalPermisos"; // Asegúrate de tener este modal
import ModalGrupo from "../../modal/grupos/modalGrupos";
import ModalHorario from "../../modal/horarios/modalHorarios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { PostDatosUser } from "../../services/user.services";
import ModalCharge from "../../modal/modalCharge";
import ModalEmpresas from "../../modal/empresas/modalEmpresas";

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [isModalSalarioOpen, setIsModalSalarioOpen] = useState(false);
  const [isModalGrupoOpen, setIsModalGrupoOpen] = useState(false);
  const [isModalHorarioOpen, setIsModalHorarioOpen] = useState(false);
  const [isModalLevelOpen, setIsModalLevelOpen] = useState(false); 
  const [isModalEmpresaOpen, setIsModalEmpresaOpen] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
     setIsLoading(true);
    
    const valuesToSend = {
      ...values,
      id_salario: parseInt(values.id_salario, 10),
      id_grupo: parseInt(values.id_grupo, 10),
      id_horarios: parseInt(values.id_horarios, 10),
      id_empleado: parseInt(values.id_empleado, 10),
      cod_empresa: parseInt(values.cod_empresa, 10),
      bono_familiar: parseInt(values.bono_familiar, 10),
    };

    
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostDatosUser(valuesToSend);
      setIsLoading(false);
      setRegistrationSuccess(true);
      resetForm();
    } catch (error) {
      console.error("error sending data", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
        setIsLoading(false);
     
    }
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box m="20px">
      <Header title="Registro de Usuarios" subtitle="Registro de Usuarios" />

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
        initialValues={{
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          cargo: "",
          id_level: "",
          id_salario: "",
          id_grupo: "",
          id_horarios: "",
          id_empleado: "",
          cod_empresa: "",
          bono_familiar: "",
        }}
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
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstname}
                name="firstname"
                error={!!touched.firstname && !!errors.firstname}
                helperText={touched.firstname && errors.firstname}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastname}
                name="lastname"
                error={!!touched.lastname && !!errors.lastname}
                helperText={touched.lastname && errors.lastname}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cargo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cargo}
                name="cargo"
                error={!!touched.cargo && !!errors.cargo}
                helperText={touched.cargo && errors.cargo}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nivel"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_level}
                name="id_level"
                error={!!touched.id_level && !!errors.id_level}
                helperText={touched.id_level && errors.id_level}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setIsModalLevelOpen(true)} // Abre el modal para seleccionar el nivel
              />
               <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Empresa"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cod_empresa}
                name="cod_empresa"
                error={!!touched.cod_empresa && !!errors.cod_empresa}
                helperText={touched.cod_empresa && errors.cod_empresa}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setIsModalEmpresaOpen(true)} // Abre el modal para seleccionar el nivel
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_salario}
                name="id_salario"
                error={!!touched.id_salario && !!errors.id_salario}
                helperText={touched.id_salario && errors.id_salario}
                sx={{ gridColumn: "span 2" }}
                onClick={() => setIsModalSalarioOpen(true)} // Abre el modal para seleccionar el salario
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Grupo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_grupo}
                name="id_grupo"
                error={!!touched.id_grupo && !!errors.id_grupo}
                helperText={touched.id_grupo && errors.id_grupo}
                sx={{ gridColumn: "span 1" }}
                onClick={() => setIsModalGrupoOpen(true)} // Abre el modal para seleccionar el salario
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Horario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_horarios}
                name="id_horarios"
                error={!!touched.id_horarios && !!errors.id_horarios}
                helperText={touched.id_horarios && errors.id_horarios}
                sx={{ gridColumn: "span 1" }}
                onClick={() => setIsModalHorarioOpen(true)} // Abre el modal para seleccionar el salario
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Empleado Número"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_empleado}
                name="id_empleado"
                error={!!touched.id_empleado && !!errors.id_empleado}
                helperText={touched.id_empleado && errors.id_empleado}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Bono Familiar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bono_familiar}
                name="bono_familiar"
                error={!!touched.bono_familiar && !!errors.bono_familiar}
                helperText={touched.bono_familiar && errors.bono_familiar}
                sx={{ gridColumn: "span 1" }} // Adjust span as needed
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Usuario
              </Button>
            </Box>

            {isModalLevelOpen && (
              <ModalPermisos
                open={isModalLevelOpen}
                onClose={() => setIsModalLevelOpen(false)}
                onSelectLevel={(id_level) =>
                  setFieldValue("id_level", id_level)
                }
              />
            )}
            {isModalSalarioOpen && (
              <ModalSalario
                open={isModalSalarioOpen}
                onClose={() => setIsModalSalarioOpen(false)}
                onSelectSalario={(salario) => {
                  setFieldValue("id_salario", salario.id); // Asigna el id del salario al campo id_salario
                  setIsModalSalarioOpen(false);
                }}
              />
            )}
            {isModalGrupoOpen && (
              <ModalGrupo
                open={isModalGrupoOpen}
                onClose={() => setIsModalGrupoOpen(false)}
                onSelectGrupo={(grupos) => {
                  setFieldValue("id_grupo", grupos.id); // Asigna el id del salario al campo id_salario
                  setIsModalSalarioOpen(false);
                }}
              />
            )}
            {isModalHorarioOpen && (
              <ModalHorario
                open={isModalHorarioOpen}
                onClose={() => setIsModalHorarioOpen(false)}
                onSelectHorario={(horario) => {
                  setFieldValue("id_horarios", horario.id); // Asigna el id del salario al campo id_salario
                  setIsModalHorarioOpen(false);
                }}
              />
            )}
              <ModalCharge isLoading={isLoading} />
              {isModalEmpresaOpen && (
              <ModalEmpresas
                open={isModalEmpresaOpen}
                onClose={() => setIsModalEmpresaOpen(false)}
                onSelectEmpresa={(empresa) => {
                  setFieldValue("cod_empresa", empresa.id); // Asigna el id del salario al campo id_salario
                  setIsModalHorarioOpen(false);
                }}
              />
            )}
          </form>
        )}
      </Formik>
    </Box>
  );
};
const checkoutSchema = yup.object().shape({
  firstname: yup.string().required("Nombre requerido"),
  lastname: yup.string().required("Apellido requerido"),
  username: yup.string().required("Username requerido"),
  password: yup.string().required("Contraseña requerida"),
  cargo: yup.string().required("Cargo requerido"),
  id_level: yup.string().required("Nivel requerido"),
  id_salario: yup.number().required("Salario requerido"),
  id_grupo: yup.number().required("Grupo requerido"),
  id_horarios: yup.number().required("Horario requerido"),
  id_empleado: yup.number().required("Empleado requerido"),
  cod_empresa: yup.number().required("Empresa requerida"),
  bono_familiar: yup
    .number()
    .typeError("Bono Familiar debe ser un número")
    .required("Bono Familiar requerido"),
});

export default Form;
