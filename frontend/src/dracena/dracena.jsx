import { Box, Typography, useTheme} from '@mui/material'
import React from 'react'
import { tokens } from "../theme";

const Dracena = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
    <Box m="20px">
    <Box
        m="40px 0 0 0"
        height="87vh"
        // backgroundColor={colors.primary[400]}
        p="20px"
        borderRadius="8px"
        sx={{
          "@media (max-width: 768px)": {
            
          },

          "@media (max-width: 468px)": {
          
          },
        }}
      >

<Box sx={{
      width:"25%",
      height:"25%",
      margin:"auto",
      marginTop:"9%"}}>
      <img src="/assets/dracena2.png" alt="logo" style={{width:"350px", height:"350px"}} />
    </Box>
     <Typography variant='h1'
     sx={{
      marginTop:"5.5%",
      marginLeft:"36%"


     }}>
      Bienvenidos al Sistema</Typography>
 
    </Box>
    </Box>
    </>
  )
}
export default Dracena
