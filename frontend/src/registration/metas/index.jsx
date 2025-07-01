import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  NativeSelect,
  useMediaQuery,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik } from "formik";
import * as yup from "yup";
import { useTheme } from "@emotion/react";

import Header from "../../components/Header";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalCharge from "../../modal/modalCharge";
import ModalGrupo from "../../modal/grupos/modalGrupos";
import ModalUserDatametas from "../../modal/user/modalUserDatametas";
import { tokens } from "../../theme";
import { PostDatosMetas } from "../../services/metas.services";

const MetasR = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpenGrupo, setModalOpenGrupo] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Special user bonuses state: array of { user: {id, firstname, lastname}, bonus: string }
  const [specialUserBonuses, setSpecialUserBonuses] = useState([
    { user: null, bonus: "" },
  ]);

  const initialValues = {
    id_plus: null,
    id_grupo: null,
    motivo: "",
    bono_produccion: "",
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { id_grupo, id_plus, motivo, bono_produccion } = values;

    // Filter valid special user bonuses (user selected and bonus > 0)
    const filteredSpecialBonuses = specialUserBonuses
      .filter((entry) => entry.user && entry.bonus && Number(entry.bonus) > 0)
      .map((entry) => ({
        userId: entry.user.id,
        bonus: Number(entry.bonus),
      }));

    const valuesToSend = {
      id_plus: parseInt(id_plus),
      id_grupo,
      motivo,
      bono_produccion: Number(bono_produccion),
      specialUserBonuses: filteredSpecialBonuses,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await PostDatosMetas(valuesToSend);
      setRegistrationSuccess(true);
      resetForm();
      setSpecialUserBonuses([{ user: null, bonus: "" }]); // reset special bonuses
    } catch (error) {
      console.error("error sending data", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  // Handle group selection from modal and reset special user bonuses
  const handleGroupSelect = (grupo, setFieldValue) => {
    setFieldValue("id_grupo", grupo.id);
    setModalOpenGrupo(false);
    setSpecialUserBonuses([{ user: null, bonus: "" }]);
  };

  // Special user input modal open states per row
  const [modalOpenUserIds, setModalOpenUserIds] = useState({});

  // Open modal for a specific special user input index
  const openUserModal = (index) => {
    setModalOpenUserIds((prev) => ({ ...prev, [index]: true }));
  };

  // Close modal for a specific index
  const closeUserModal = (index) => {
    setModalOpenUserIds((prev) => ({ ...prev, [index]: false }));
  };

  // Handle user selection for special user input at index
  const handleUserSelect = (index, user) => {
    const newEntries = [...specialUserBonuses];
    newEntries[index].user = user;
    setSpecialUserBonuses(newEntries);
    closeUserModal(index);
  };

  // Handle bonus input change at index
  const handleBonusChange = (index, value) => {
    const newEntries = [...specialUserBonuses];
    newEntries[index].bonus = value;
    setSpecialUserBonuses(newEntries);
  };

  // Add new special user bonus input row
  const addEntry = () => {
    setSpecialUserBonuses([...specialUserBonuses, { user: null, bonus: "" }]);
  };

  // Remove special user bonus input row
  const removeEntry = (index) => {
    const newEntries = specialUserBonuses.filter((_, i) => i !== index);
    setSpecialUserBonuses(newEntries);
  };

  return (
    <Box m="20px">
      <Header title="Registro Metas" subtitle="Registro de Estado de Metas" />

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

                "& .MuiOutlinedInput-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  background: `${colors.primary[950]} !important`,
                  borderBottom: `1px solid ${colors.grey[100]} !important`,
                },
                "& .MuiInputBase-input": {
                  color: `${colors.grey[100]} !important`,
                },

                "& .MuiInputLabel-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiSvgIcon-root": {
                  color: `${colors.grey[100]} !important`,
                  zIndex: 10,
                },
                "& .MuiInputLabel-root": {
                  zIndex: 200,
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px",
                  zIndex: 100,
                },
                "&  .css-kv600j-MuiFormLabel-root-MuiInputLabel-root ": {
                  marginTop: "-20px!important",
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Grupo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_grupo}
                name="id_grupo"
                error={!!touched.id_grupo && !!errors.id_grupo}
                helperText={touched.id_grupo && errors.id_grupo}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpenGrupo(true)}
              />
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Seleccione una Valor
                  </InputLabel>
                  <NativeSelect
                    inputProps={{
                      name: "id_plus",
                      id: "uncontrolled-native",
                    }}
                    value={values.id_plus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.id_plus && !!errors.id_plus}
                  >
                    <option value=""></option>
                    <option value="1">Meta Alcanzada</option>
                    <option value="2">Meta No Alcanzada</option>
                  </NativeSelect>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Motivo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.motivo}
                name="motivo"
                error={!!touched.motivo && !!errors.motivo}
                helperText={touched.motivo && errors.motivo}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Bono Producción"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bono_produccion}
                name="bono_produccion"
                error={!!touched.bono_produccion && !!errors.bono_produccion}
                helperText={touched.bono_produccion && errors.bono_produccion}
                sx={{ gridColumn: "span 1" }}
              />
            </Box>

            {/* Special User Bonuses Section */}
            <Box mt={3}>
              <Box
                mb={1}
                fontWeight="bold"
                fontSize="1.1rem"
                color={colors.grey[100]}
              >
                Bonos Especiales por Usuario
              </Box>

              {specialUserBonuses.map((entry, index) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={index}
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={6}>
                    <TextField
                      label="Usuario Especial"
                      variant="filled"
                      value={
                        entry.user
                          ? `${entry.user.firstname} ${entry.user.lastname}`
                          : ""
                      }
                      onClick={() => openUserModal(index)}
                      InputProps={{
                        readOnly: true,
                        sx: { cursor: "pointer" },
                      }}
                      fullWidth
                    />
                    {modalOpenUserIds[index] && (
                      <ModalUserDatametas
                        open={modalOpenUserIds[index]}
                        onClose={() => closeUserModal(index)}
                        onSelectUsuario={(usuario) =>
                          handleUserSelect(index, usuario)
                        }
                        id_grupo={values.id_grupo} 
                      />
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Bono Especial"
                      variant="filled"
                      type="number"
                      value={entry.bonus}
                      onChange={(e) => handleBonusChange(index, e.target.value)}
                      inputProps={{ min: 0, step: "0.01" }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => removeEntry(index)}
                      aria-label="remove"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addEntry}
                sx={{ mt: 1 }}
              >
                Agregar Usuario Especial
              </Button>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>

            <ModalCharge isLoading={isLoading} />
            <ModalGrupo
              open={modalOpenGrupo}
              onClose={() => setModalOpenGrupo(false)}
              onSelectGrupo={(grupo) => handleGroupSelect(grupo, setFieldValue)}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_plus: yup.number().required("Requerido"),
  id_grupo: yup.number().required("Requerido"),
  motivo: yup.string().nullable().required("Requerido"),
  bono_produccion: yup
    .number()
    .typeError("Bono de producción debe ser un número")
    .required("Bono de producción requerido"),
});

export default MetasR;