import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { getFrases, PostLogin } from "../services/login.services";
import ModalCharge from "../modal/modalCharge";
import { useNavigate } from "react-router-dom";
import ModalError from "../modal/modalError";

export const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [registrationError, setRegistrationError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (id === "user") {
      setUsername(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { username, password };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await PostLogin(data);

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("cod_empresa", response.cod_empresa);
      localStorage.setItem("userLevel", response.id_level);
      localStorage.setItem("user", response.username);
      localStorage.setItem("turno", response.id_horarios);
      localStorage.setItem("id", response.id);
      localStorage.setItem("llave", response.llave);


      const token = await response.token;
      if (token) {
        setIsLoading(false);
        setLevel(response.id_level);
        navigate("/");
        window.location.reload();
      } else {
        throw new Error("No se encontró el token.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setRegistrationError(true);
      setIsLoading(false);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Box
        sx={{
          background: "#1b2136",
          width: "100%",
          height: "90vh",
          paddingLeft: "15vh",
          marginTop: "23vh",
          borderRadius: "10px",
          display: "flex",
          "@media (max-width: 768px)": {
            flexDirection: "column",
            paddingLeft: "0",
            marginTop: "10vh",
            height: "auto",
            padding: "20px",
          },
        }}
      >
        <Box
          sx={{
            borderRight: "1.5px solid rgb(61, 66, 84)",
            padding: "10px 20px 10px 10px",
            height: "43vh",
            "@media (max-width: 768px)": {
              borderRight: "none",
              height: "auto",
              padding: "10px",
              textAlign: "center",
            },
          }}
        >
          <img
            className="logo"
            style={{
              width: "250px",
              height: "100px",
              justifyContent: "start",
              marginLeft: "-2.9vh",
              "@media (max-width: 768px)": {
                marginLeft: "0",
                width: "200px",
                height: "80px",
              },
            }}
            src="../../assets/dracenaS.png"
            alt="logo"
          />
          <Box
            sx={{
              width: "100%",
              height: "40%",
              fontSize: "24px",
              paddingTop: "10px",
              marginRight: "14vh",
              fontFamily: "ContiSans",
              "@media (max-width: 768px)": {
                display: "none",
              },
            }}
          >
            <p className="MuiTypography-root MuiTypography-body1 jss17 css-1eo7ssg">
              Ser práctico, te hace grande.
              <br />
              Accedé al Sistema Web desde cualquier lugar.
            </p>
          </Box>
        </Box>

        <Box
          sx={{
            paddingLeft: "2vh",
            "@media (max-width: 768px)": {
              // paddingLeft: "0",
              // textAlign: "center",



              // input Contraseña
             "& .css-6hvovs-MuiFormControl-root-MuiTextField-root": {
            // display: "flex",
            //  flexDirection: "column",
            //  justifyContent: "center",
            //    alignItems: "center",
            //   textAlign: "center",
              maxWidth: "100%",
              },

              // input usuario
             "& .css-gaw78z-MuiFormControl-root-MuiTextField-root": { 
              maxWidth: "100%",
              width: "100%",

            },
            
            "& .css-9kw488-MuiButtonBase-root-MuiButton-root": { 
              // display: "flex",
              // alignContent: "center",
              // justifyContent: "center",
              maxWidth: "50vh",
              width: "120%",
              // paddingLeft: "",
            }

            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "40%",
              fontSize: "24px",
              paddingTop: "10px",
              fontFamily: "ContiSans",
              "@media (max-width: 768px)": {
                fontSize: "20px",
              },
            }}
          >
            <p className="MuiTypography-root MuiTypography-body1 jss23 css-1eo7ssg">
              Inicia sesión en tu Online Acount
            </p>

            <Box
              sx={{
                width: "67vh",
                height: "8%",
                fontSize: "18px",
                paddingTop: "8%",
                fontFamily: "ContiSans",
                "@media (max-width: 768px)": {
                  width: "100%",
                  paddingTop: "20px",
                },
              }}
            >
              <Box>
                <img
                  style={{
                    width: "270px",
                    height: "22px",
                    justifyContent: "start",
                    marginLeft: "-1%",
                    "@media (max-width: 768px)": {
                      width: "200px",
                      height: "18px",
                      marginLeft: "0",
                    },
                  }}
                  src="../../assets/troll.png"
                  alt="logo"
                />
              </Box>

              <Box
                sx={{
                  height: "100%",
                }}
              >
                <TextField
                  className="input"
                  id="user"
                  variant="filled"
                  type="text"
                  placeholder="Ingrese su Usuario"
                  value={username}
                  onChange={handleChange}
                  sx={{
                    display: "flex",
                    marginTop: "2vh",
                    margin: "2vh 0px 1.5vh",
                    height: "6vh",
                    borderRadius: "10px",
                    background: "0px",
                    borderBottom: "none",
                    minWidth: "0px",
                    // width: "33.5vw",
                    width: "99%",
                    letterSpacing: "inherit",
                    color: "currentcolor",
                    marginBottom: "0.2vh",
                    "& .MuiFilledInput-root": {
                      backgroundColor: "rgb(27 33 54)",
                      font: "inherit",
                      letterSpacing: "inherit",
                      fontSize: "18px",
                      color: "rgb(174 168 168)",
                      fontWeight: "bold!important",
                    },
                    "@media (max-width: 768px)": {
                      width: "100%",
                      maxWidth: "100%",
                    },
                    "@media (max-width: 468px)": {
                      margin: "2vh 0px 1.5vh",
                      width: "99%",
                      maxWidth: "100%",
                    },
                  }}
                />

                <TextField
                  className="input"
                  id="password"
                  variant="filled"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su Contraseña"
                  value={password}
                  onChange={handleChange}
                  sx={{
                    marginTop: "2vh",
                    height: "6vh",
                    borderRadius: "10px",
                    background: "0px",
                    borderBottom: "none",
                    minWidth: "0px",
                    width: "33.5vw",
                    letterSpacing: "inherit",
                    color: "currentcolor",
                    marginBottom: "2vh",
                    "& .MuiBox-root css-1hjg6xp": {
                    display: "block",  
                    },

                    "& .MuiFilledInput-root": {
                      backgroundColor: "rgb(27 33 54)",
                      font: "inherit",
                      letterSpacing: "inherit",
                      fontSize: "18px",
                      color: "rgb(174 168 168)",
                      fontWeight: "bold!important",
                    },
                    "& .css-sk000x-MuiFormControl-root-MuiTextField-root": {
                      display: "flex",
                    },
                   
                    "@media (max-width: 768px)": {

                      width: "100%",
                      maxWidth: "600px",
                    },

                    "@media (max-width: 468px)": {
                      margin: "2vh 0px 1.5vh",
                      width: "99%",
                      maxWidth: "100%",
                    },
                  }}
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

                <Box
                  sx={{
                    width: "70vh",
                    height: "8vh",
                    fontSize: "24px",
                    paddingTop: "10px",
                    fontFamily: "ContiSans",
                    display: "flex",
                    // justifyContent: "end",
                    alignItems: "end",
                    "@media (max-width: 768px)": {
                      width: "100%",
                      justifyContent: "center",
                    },
                  }}
                >
                  <Button
                    onClick={(e) => handleLogin(e)}
                    sx={{
                      width: "12vw",
                      height: "5.5vh",
                      color: "rgba(255, 255, 255, 0.5)",
                      border: "1.5px solid rgba(255, 255, 255, 0.5)",
                      textTransform: "initial",
                      backgroundColor: "#3D4254",
                      fontSize: "20px",
                      boxShadow: "none",
                      borderRadius: "10px",
                      marginTop: "3vh",
                      "&:hover": {
                        backgroundColor: "#1b2136",
                      },
                      "@media (max-width: 768px)": {
                        width: "100%",
                        maxWidth: "200px",
                        marginTop: "3vh",
                      },
                    }}
                  >
                    Ingresar
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "30vh",
              height: "30vh",
              color: "withe",
              marginTop: "30vh",
              "@media (max-width: 768px)": {
                marginTop: "20px",
                  paddingLeft: "20vh",
                width: "100%",
              },
            }}
          >
            <p
              className="MuiTypography-root MuiTypography-body1 jss21 css-1eo7ssg"
              style={{
                marginLeft: "-16vh",
                fontSize: "15px",
                "@media (max-width: 768px)": {
                },
              }}
            >
              © 2025 Maquila Grupo Dracena S.A
            </p>
          </Box>
        </Box>
      </Box>

      <ModalCharge isLoading={isLoading} />
      <ModalError
        open={registrationError}
        onClose={handleCloseModalError}
        error={error}
      />
    </>
  );
};

export default Login;