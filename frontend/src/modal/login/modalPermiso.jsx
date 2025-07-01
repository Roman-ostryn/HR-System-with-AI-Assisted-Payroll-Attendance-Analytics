
import React, { useState } from 'react';
import { Box, Modal, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import {PostLogin} from "../../services/login.services"
import ModalCharge from "../modalCharge";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";

const ModalPermiso = ({ open, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleLogin = async () => {
    setIsLoading(true);
      const data = {
        username: username,
        password: password
      }
      try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostLogin(data);
      if (onSuccess) {
        onSuccess(response.id_level); // Enviar la respuesta al componente padre
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError(error.message || "Ocurrió un error en el login.");
    } finally {
      setIsLoading(false);
    }
    
    onClose();
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
    // setInitialValues({ serie: "" });
  };
  
  return (
    <Modal
  open={open}
  onClose={onClose}
  aria-labelledby="modal-permiso-title"
  aria-describedby="modal-permiso-description"
  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}
  BackdropProps={{
    style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  }}
>
  <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary[600],
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <Typography id="modal-permiso-title" variant="h3" component="h2">
        Ingrese su Usuario
      </Typography>
      <Typography id="modal-permiso-subtitle" variant="h5" component="h2" sx={{color: "rgb(206, 220,0)"}}>
        Permiso requerido
      </Typography>
      <TextField
        label="Usuario"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Contraseña"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{ marginTop: "20px", backgroundColor: "rgb(206, 220,0)"}}
      >
        Iniciar Sesión
      </Button>
    </Box>

    {/* Modales secundarios */}
    <ModalCharge isLoading={isLoading} />
    <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
    <ModalError open={registrationError} onClose={handleCloseModalError} error={error} />
  </>
</Modal>

  );
};

export default ModalPermiso