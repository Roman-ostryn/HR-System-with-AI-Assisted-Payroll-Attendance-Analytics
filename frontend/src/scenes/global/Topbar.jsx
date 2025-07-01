
import {
  Box,
  IconButton,
  useTheme,
  Badge,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Logout from "../../modal/Logout";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

import getUrlSocket from "../../utils/getUrlSocket"; // Asegúrate de que esta función esté correctamente definida

// Conectar con el servidor de Socket.IO
const socket = io(getUrlSocket());

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [showCard, setShowCard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Obtener el nivel del usuario desde localStorage
  const userLevel = localStorage.getItem("userLevel");

  // Solicitar permiso para notificaciones del navegador
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Escuchar notificaciones desde el backend
    socket.on("newDataNotification", (data) => {
      setNotifications((prev) => [data, ...prev]); // Agregar la nueva notificación
      setNotificationCount((prev) => prev + 1); // Incrementar el contador de notificaciones
      showBrowserNotification(data.message); // Mostrar notificación del navegador
    });

    // Limpiar el socket cuando el componente se desmonte
    return () => socket.off("newDataNotification");
  }, []);

  // Función para mostrar notificación del navegador
  const showBrowserNotification = (message) => {
    const fixedMessage = message.replace(
      "192.168.88.69:5001",
      "HeliosGlass.com"
    );
    if (Notification.permission === "granted") {
      new Notification("Nueva Notificación", {
        body: fixedMessage,
        icon: "/notificacion-icon.png",
      });
    }
  };

  // Función para mostrar u ocultar el menú de notificaciones
  const toggleNotifications = () => {
    if (showNotifications) {
      // Si se está cerrando el menú, limpiar notificaciones
      setNotifications([]); // Limpiar las notificaciones
      setNotificationCount(0); // Resetear el contador de notificaciones
    }
    setShowNotifications(!showNotifications); // Alternar visibilidad
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    localStorage.clear();
    navigate("/login", { state: { forceRender: true } });
  };

  return (
    <>
      {/* <Box
        display="flex"
        justifyContent="end"
        p={2}
        sx={{ borderBottom: "1px solid rgb(61, 66, 84)",
         "@media (min-width: 390px) and (max-width: 500px) ": {
            // backgroundColor: "red",
            justifyContent: "center",
            // marginLeft: "-10%",
          
        }
        }}
      > */}
<Box
  display="flex"
  justifyContent="flex-end"
  flexWrap="wrap"
  p={2}
  sx={{
    borderBottom: "1px solid rgb(61, 66, 84)",
    "@media (max-width: 600px)": {
      justifyContent: "center",
    },
  }}
>

        {/* ICONOS */}
        <Box display="flex" padding="10px" sx={{ 
           
         }}>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          {/* 🔔 Mostrar la campana SOLO si el usuario es nivel 1 */}
          {userLevel === "1" && (
            <Box sx={{ position: "relative" }}>
              <IconButton onClick={toggleNotifications}>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>

              {/* Menú de Notificaciones */}
              {showNotifications && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    width: "250px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    background: "#242b43",
                    borderRadius: "6px",
                    border: "1px solid #c3c6ce",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    animation: "fadeIn 0.3s ease-in-out",
                    zIndex: 1000,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ p: 1, color: "#fff", textAlign: "center" }}
                  >
                    Notificaciones
                  </Typography>
                  <Divider />
                  <List>
                    {notifications.length === 0 ? (
                      <ListItem>
                        <ListItemText
                          primary="No hay notificaciones"
                          sx={{ color: "#fff", textAlign: "center" }}
                        />
                      </ListItem>
                    ) : (
                      notifications.map((notif, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={notif.message}
                            sx={{ color: "#fff" }}
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          )}

          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>

          {/* Icono de Usuario */}
          <Box sx={{ position: "relative" }}>
            <IconButton onClick={() => setShowCard(!showCard)}>
              <PersonOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Tarjeta de Cerrar Sesión */}
      {showCard && (
        <Box
          sx={{
            marginLeft: "72%",
            marginTop: "-2.6vh",
            width: "12%",
            height: "6%",
            background: "#242b43",
            borderRadius: "6px",
            border: "1px solid #c3c6ce",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 0.3s ease-in-out",
            position: "absolute",
            zIndex: 1000,
            cursor: "pointer",

            "@media (max-width: 768px)": {
              marginTop: "-5%",
              marginLeft: "37vh",
              width: "15vh",
            },

            "@media (max-width: 468px)": {
              // margin: "2vh 0px 1.5vh",
              width: "45%",
              marginTop: "-6%",
              marginLeft: "12vh",
            },
          }}
        >
          <Box
            sx={{
               marginTop: "-4%", width: "99%", height: "45%", zIndex: 100 }}
            onClick={handleLogout}
          >
            <Logout />
          </Box>
        </Box>
      )}

      {/* Animación CSS */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </>
  );
};

export default Topbar;
