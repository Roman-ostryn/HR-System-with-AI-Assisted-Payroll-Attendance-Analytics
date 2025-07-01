import React from 'react';
import { LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LoadingSpinner from './index';
import { Box } from "@mui/material";

const useStyles = makeStyles(() => ({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // Fondo completamente transparente
  },
  text: {
    fontSize: "18px",
    color: "#333",
    fontWeight: "bold",
  },
  progressBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1400, // La barra se mantiene encima de otros elementos
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#cedc00", // Barra de progreso en verde
    },
  },
  loader: {
    width: "90px",
    height: "14px",
    boxShadow: "0 3px 0 #fff",
    background:
      "repeating-linear-gradient(90deg,#fff 0 14px,#0000 0 100%) 0 0/calc(100%/4) 100%",
    animation: "l1 1s infinite linear",
   
  },
  "@keyframes l1": {
    "100%": { backgroundPosition: "calc(100%/5) 0" },
  },
}));

const TopLoadingBar = () => {
  const classes = useStyles();

  return (
    <>
      <LinearProgress className={classes.progressBar} />
      <div style={{
        background:"rgb(27 33 54)",
        height:"100%"
      }}>
       <Box
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-40%, -50%)",
        // backGroundColor:"red"
        filter: "brightness(1)"
      }}
    >
       <img
        style={{
          width: "300px",
          height: "230px",
          paddingBottom:"10%"
        }}
        src="../../assets/xd1.gif"
        alt="Loading..."
      />
      
      <Box sx={{
        // background:"red",
        marginTop:"-15%",
        marginLeft:"50%"
      }}>

      <div className="loader"></div>
      {/* <div class="loader"></div> */}


      </Box>
    </Box>
      </div>
    </>
  );
};

export default TopLoadingBar;

