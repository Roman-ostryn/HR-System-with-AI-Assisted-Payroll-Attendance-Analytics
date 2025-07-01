import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  InputBase,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Switch,
  FormControlLabel
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getDatosUser, putDatosUser  } from "../../services/user.services";
import ModalHorario from "../../modal/horarios/modalHorarios";
import ModalGrupo from "../../modal/grupos/modalGrupos";
import { Password, Update, Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { use } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../loadingSpinner";
import ModalCharge from "../../modal/modalCharge";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";

const Usuarioview = () => {
  const [data, setData] = useState([]); // Datos de usuarios
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la tabla
  const [openModal, setOpenModal] = useState(false); // Controlar si el modal está abierto
  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado
  const [horario, setHorario] = useState(""); // Estado para el horario
  const [grupo, setGrupo] = useState(""); // Estado para el grupo
  const [nuevoPassword, setNuevoPassword] = useState(""); //Estado para la contrasenha
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [openModalHorario, setOpenModalHorario] = useState(false); //Estado que controla la apertura del modal
  const [openModalGrupo, setOpenModalGrupo] = useState(false); // Estado que controla el modal de grupos
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(""); // Estado para el grupo seleccionado
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [cambiarPassword, setCambiarPassword] = useState(false); //Permite controlar si se quiere cambiar la contrasena
  const [userLevel, setUserLevel] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }
  const handleClickshowConfirmPassword = () => {
    setConfirmPassword(!showConfirmPassword);
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Definir columnas de la tabla
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "id_empleado", headerName: "ID_Empleado", flex: 1 },
    {
      field: "firstname",
      headerName: "Nombre",
      flex: 2,
      cellClassName: "name-column--cell", // Aplicamos esta clase personalizada
    },
    {
      field: "lastname",
      headerName: "Apellido ",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "username",
      headerName: "Nombre Usuario ",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cargo",
      headerName: "Cargo  ",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
  ];

  // Obtener datos de los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      const level = localStorage.getItem('userLevel');
          if (level) {
          setUserLevel(parseInt(level));
          }
      try {
        const response = await getDatosUser() ;
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error al obtener los grupos del backend:", error);
      }
    };

    fetchUsuarios();
  }, []);

  
  // Manejar la búsqueda en la tabla
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    const filtered = data.filter(
      (item) =>
        item.firstname.toLowerCase().includes(value.toLowerCase()) ||
        item.lastname.toLowerCase().includes(value.toLowerCase()) ||
        item.username.toLowerCase().includes(value.toLowerCase()) ||
        item.cargo.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  // Manejar el doble clic en una fila para abrir el modal
  const handleRowDoubleClick = (rowData) => {
    setSelectedUser(rowData);
    setHorario(rowData.id_horarios); // Establece el valor predeterminado de horario
    setGrupo(rowData.id_grupo); // Establece el valor predeterminado de grupo Resetear grupo
    setOpenModal(true); // Abrir modal
  };

  // Manejar el cierre del modal sin guardar cambios
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setConfirmarPassword("");
    setNuevoPassword("");
    setCambiarPassword(false);
    setShowPassword(false);
    setConfirmPassword(false);
  };
  const handleCloseModalRegistration = () => {
    setRegistrationSuccess(false);
  };

  // Manejar el guardar cambios (ejemplo simple de manejo)
  const handleSaveChanges = async() => {

  if (!horario) {
    toast.error('Debes seleccionar un Horario', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return; // Detener la ejecución si no se ha seleccionado horario o grupo
  }

  if (!grupo) {
    toast.error('Debes seleccionar un Grupo', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return; // Detener la ejecución si no se ha seleccionado horario o grupo
  }


    
  if (cambiarPassword && nuevoPassword !== confirmarPassword) {
    toast.error(
                `Las contraseñas no coinciden`,
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
    return; // Evitar guardar los cambios si las contraseñas no coinciden
  }
  if (cambiarPassword && nuevoPassword.length < 5) {
    toast.error(`La contraseña debe tener al menos 5 caracteres`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return; // Evitar guardar los cambios si la contraseña es demasiado corta
    
    
  }

  setIsLoading(true);

  const uptdateusuario = {
    id_horarios:  horario,
    id_grupo: grupo,
    ...(cambiarPassword && {Password: nuevoPassword})
  };
  console.log(uptdateusuario);
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await putDatosUser(selectedUser.id, uptdateusuario);
        setRegistrationSuccess(true);
        resetInput();
        // console.log("server response", response);
      } catch (error) {
        console.error("error sending data", error);
        setRegistrationError(true);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
  // Cerrar modal después de guardar
  setOpenModal(false);
};

  // Función para seleccionar el horario desde el modal
  const handleSelectHorario = (horarioSeleccionado) => {
    console.log(
      "🚀 ~ handleSelectHorario ~ horarioSeleccionado:",
      horarioSeleccionado
    );
    setHorario(horarioSeleccionado.id); // Actualizar el horario seleccionado
    setOpenModalHorario(false); // Cerrar el modal de horarios
  };

  const resetInput = () => {
    setConfirmarPassword("");
    setNuevoPassword("");
  };
  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Usuarios" subtitle="Lista de Usuarios Disponibles" />
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"50%"}
            width={"90%"}
            ml={1}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Buscar"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
          getRowId={(row) => row.id}
          onRowDoubleClick={(e) => handleRowDoubleClick(e.row)} // Doble clic en una fila
          sx={{
            "& .MuiDataGrid-cell.name-column--cell": {
              color: colors.greenAccent[300], // Asegura que el texto de la columna "Nombre" sea verde
            },
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[900],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[900],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        />
      </Box>

      {/* Modal para editar detalles del usuario */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          "& .MuiDialog-paper": {
            width: "40%", // Cambiar al porcentaje que prefieras, también puedes usar px (por ejemplo, 600px)
            // maxWidth: "500px", // Puedes cambiar el máximo de ancho
            height: "65vh", // Altura del modal, también puedes usar px
            borderRadius: "10px", // Opcional: para bordes redondeados
          },
        }}
      >
        <DialogTitle
          backgroundColor={colors.primary[400]}
          fontSize={30}
          padding={5}
        >
          Editar Usuario
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: colors.primary[400],
            padding: "20px"
          }}
        >
          {selectedUser && (
            <Box>
              <Box display={"flex"} justifyContent="space-between" width="100%" >
                <Box >
                  <strong>ID:</strong> {selectedUser.id}
                </Box>
                <Box display={"flex"} justifyContent={"center"} flexGrow={1}>
                  <strong>USUARIO:</strong>{selectedUser.firstname}{" "}
                  {selectedUser.lastname}
                </Box>
            </Box>
              <TextField
                label="Horario"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                onClick={() => setOpenModalHorario(true)} // Aquí se abre el modal cuando haces clic en el input
                fullWidth
                sx={{ marginTop: 2 }}
                readOnly
              />
              <TextField
                label="Grupo"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
                onClick={() => setOpenModalGrupo(true)} // Abrir el modal de grupos
                fullWidth
                sx={{ marginTop: 2 }}
              />
               {/* Switch para controlar la visibilidad de los campos de contraseña */}
                {userLevel === 1 && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={cambiarPassword}
                        onChange={() => setCambiarPassword(!cambiarPassword)}
                        sx={{
                          "& .MuiSwitch-thumb": {
                            backgroundColor: "primary",
                          },
                          "& .Mui-checked .MuiSwitch-thumb": {
                            backgroundColor: "rgb(206, 220, 0)",
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: "rgb(206, 220, 0)",
                          },
                          "& .Mui-checked .MuiSwitch-track": {
                            backgroundColor: "rgb(206, 220, 0)",
                          },
                        }}
                      />
                    }
                    label="Cambiar Contraseña"
                    sx={{
                      marginTop: "10px",
                    }}
                  />
                )}
              {cambiarPassword && (
                <>
                  <TextField
                    label="Cambiar Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    fullWidth
                    sx={{ marginTop: 2 }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={handleClickShowPassword} // Al hacer clic en el ícono, se alterna la visibilidad
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirmar Contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    fullWidth
                    sx={{ marginTop: 2 }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={handleClickshowConfirmPassword} // Al hacer clic en el ícono, se alterna la visibilidad
                          edge="end"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      ),
                    }}
                  />
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: colors.primary[400],
          }}
        >
          <Button
            onClick={handleCloseModal}
            color="primary"
            sx={{
              backgroundColor: "red",
              border: "none",
              color: "#ffffff",
              height: "5vh",
              width: "8vw",
              borderRadius: "20px",
              cursor: "pointer",
              marginRight: "1vw",

              "&:hover": { backgroundColor: "#910707" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            sx={{
              backgroundColor: "rgb(206, 220, 0)",
              border: "none",
              color: "black",
              height: "5vh",
              width: "8vw",
              borderRadius: "20px",
              cursor: "pointer",
              marginRight: "1vw",

              "&:hover": { backgroundColor: "#bac609" },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ModalHorario
        open={openModalHorario}
        onClose={() => setOpenModalHorario(false)}
        onSelectHorario={handleSelectHorario}
      />
      <ModalGrupo
        open={openModalGrupo}
        onClose={() => setOpenModalGrupo(false)}
        onSelectGrupo={(grupoSeleccionado) => {
          setGrupo(grupoSeleccionado.id); // Actualiza el estado con el grupo seleccionado
          setOpenModalGrupo(false); // Cierra el modal
        }}
      />
      <ModalCharge isLoading={isLoading} />
        {isLoading && <LoadingSpinner />}
            {registrationSuccess && (
              <ModalSucces open={registrationSuccess} onClose={handleCloseModalRegistration} />
            )}
            {registrationError && (
              <ModalError
                open={registrationError}
                onClose={handleCloseModalError}
                error={error}
              />
            )}
    </Box>
  );
};

export default Usuarioview;
