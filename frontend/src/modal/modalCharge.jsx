import { Box, Modal, Backdrop} from '@mui/material';

import React from 'react'
import LoadingSpinner from '../loadingSpinner';
import '../css/styles.css';
const ModalCharge = ({isLoading, onClose}) => {
  return (
    <Modal
        open={isLoading} // Usar open en lugar de isLoading
        aria-labelledby="loading-modal-title"
        aria-describedby="loading-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none", // Asegúrate de que no tenga bordes
            padding: 0, // Quita el padding si es necesario
            margin: 0,
           background:"none",
          
           
          }}
        >
          <LoadingSpinner />
          {/* <Box
            sx={{
              marginTop:"90%",
              marginLeft:"60%",
              width: "fit-content",
              fontWeight: "bold",
              fontFamily: "monospace",
              whiteSpace: "pre",
              fontSize: "20px",
              lineHeight: "1.2em",
              height: "1.2em",
              overflow: "hidden",
              "&:before": {
                content: `"Loading...\\A⌰oading...\\A⌰⍜ading...\\A⌰⍜⏃ding...\\A⌰⍜⏃⎅ing...\\A⌰⍜⏃⎅⟟ng...\\A⌰⍜⏃⎅⟟⋏g...\\A⌰⍜⏃⎅⟟⋏☌...\\A⌰⍜⏃⎅⟟⋏☌⟒..\\A⌰⍜⏃⎅⟟⋏☌⟒⏁.\\A⌰⍜⏃⎅⟟⋏☌⟒⏁⋔"`,
                whiteSpace: "pre",
                display: "inline-block",
                animation: "l39 1s infinite steps(11) alternate",
                zIndex: 1500,
              },
              "@keyframes l39": {
                "100%": { transform: "translateY(-100%)" },
              },
            }}
          ></Box> */}
           <Box
      sx={{
        paddingTop:"60%",
        marginLeft:"50%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '200px', // Ajusta el tamaño según tu preferencia
        height: '200px',
        background: "none",
        margin: "0"
      }}
    >
      <div className="loader"></div>
    </Box>
          
        </Box>
      </Modal>
  )
}
export default ModalCharge;
