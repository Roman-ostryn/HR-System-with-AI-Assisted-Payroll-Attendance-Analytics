import React from 'react'
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme"; // Asegúrate de importar adecuadamente tu tema si lo necesitas
import HomeIcon from "@mui/icons-material/Home";
import GrassIcon from '@mui/icons-material/Grass';
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Registration = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const buttonStyles = {
        width: "200px",
        height: "200px",
        backgroundColor: colors.primary[400], // Ajusta el color según tu tema
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        transition: "transform 0.3s ease", // Añade una transición para suavizar el efecto
        "&:hover": {
            transform: "translateY(-5px)" // Mueve el botón hacia arriba al hacer hover
        }
    };

    return (
        <Box m="20px">
            <Header marginTop={30} title="REGISTROS" subtitle="Formulario de Registros"/>
            <Box marginLeft={20}
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap="20px"
                marginTop="20px"
            >   <Link to={"/activity"}>
                <Box sx={buttonStyles}>
                    <HomeIcon
                        sx={{ color: colors.greenAccent[600], fontSize: "80px" }} // Ajusta el color y tamaño del icono según tu preferencia
                    />
                </Box>
                </Link>
                <Link to={"/products"}>
                <Box sx={buttonStyles}>
                    <GrassIcon
                        sx={{ color: colors.greenAccent[600], fontSize: "80px" }} // Ajusta el color y tamaño del icono según tu preferencia
                    />
                    
                </Box>
                </Link>

                <Link to={"/owner"}>
                <Box sx={buttonStyles} >
                    <PersonAddIcon
                        sx={{ color: colors.greenAccent[600], fontSize: "80px" }} // Ajusta el color y tamaño del icono según tu preferencia
                    />
                </Box>
                </Link>
            </Box>
            <Box marginLeft={20}
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gap="20px"
                marginTop="20px"
            >
                
                    <Typography sx={{paddingLeft:"20%", color: colors.greenAccent[600], fontSize: "20px"}}>Trabajos</Typography>
                    <Typography sx={{paddingLeft:"18%", color:colors.greenAccent[600], fontSize:"20px"}}>Productos</Typography>
                    <Typography sx={{paddingLeft:"15%", color:colors.greenAccent[600], fontSize:"20px"}}>Propietarios</Typography>
            
              
            </Box>
        </Box>

        
    );
};

export default Registration;
