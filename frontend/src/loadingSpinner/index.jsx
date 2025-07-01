// LoadingSpinner.jsx
import { Box } from "@mui/material";
import React from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";


const LoadingSpinner = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
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
      
     
    </Box>
  );
};

export default LoadingSpinner;
