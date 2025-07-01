import {React, useEffect, useState} from 'react'
import { Box, Button, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DeleteDatos, getOneDatos } from "../services/owner.services";
import useTheme from "@mui/material/styles/useTheme";
import { tokens } from "../theme";
import ModalCharge from "../modal/modalCharge";
import ModalDeleteSucces from "../modal/modalDeleteSucces";
import ModalError from "../modal/modalError";



const ModalDialogo = ({open, onClose, onSelectClient }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteRegistrationSuccess, setDeleteRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [registrationError, setRegistrationError] = useState(false);


  // const [filteredData, setFilteredData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // const columns = [
  //   { field: "id", headerName: "ID" },
  //   { field: "nombre", headerName: "NOMBRE", flex: 1 },
  //   { field: "apellido", headerName: "APELLIDO", flex: 1 },
  //   { field: "direccion", headerName: "DIRECCION", flex: 1 },
  // ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const datos = await getOneDatos(onSelectClient);
  //       const datosConId = datos.map((item, index) => ({ ...item, id: index + 1 }));
  //       setData(datosConId);
  //     } catch (error) {
  //       console.error("Error al obtener datos del backend:", error);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  const handleDelete = () => {
    setIsLoading(true);
    putData(onSelectClient);
  }

  

  const putData = async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await DeleteDatos(id);
      const responseData = await response;
       setIsLoading(false);
       setDeleteRegistrationSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onClose();
    } catch (error) {
           setIsLoading(false);
           setRegistrationError(true);
           setError(error.message);
         await new Promise((resolve) => setTimeout(resolve, 2000));
         onClose();

    }
  };  
  
  
   const handleCloseModal = () => {
    setDeleteRegistrationSuccess(false);
   // resetForm();
 };

 const handleCloseModalError = () => {
  setRegistrationError(false);
};
const handleCloseModalCancel = () => {
  onClose();
};



  return (
    <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="registration-failed-modal-title"
        aria-describedby="registration-failed-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
        }}
      >
 
        <Box
        
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
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
            "& .MuiButton-root.css-s8qyrg-MuiButtonBase-root:hover": {
              backgroundColor: `${colors.grey[800]} !important`,
            },
            

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            //  bgcolor: "background.paper",
             height:"40%",
             width:"40%",
            p: 4,
            zIndex: 1500, // Ajustar z-index para que aparezca por encima del fondo
          }}
          backgroundColor={colors.primary[700]}

        >
          <h2 id="registration-failed-modal-title" >¿Seguro que Deseas Eliminar este Registro ? {}</h2>
         
          {/* <DataGrid
           sx={{width:"90%",  height:"50%",}}
          rows={data}
          columns={columns}
          // onSelectionModelChange={handleRowSelection}
          // selectionModel={selectedRowIds}
          disableMultipleSelection={true}
        /> */}
        <Box sx={{
          display:"flex",
        }}>
         <Button onClick={handleCloseModalCancel} color="secondary" variant="contained"  sx={{marginTop:"5%", marginRight:"5%", backgroundColor:"#e41811", color:"#ffffff "}}>
            Cancelar
          </Button>
         <Button onClick={handleDelete} color="secondary" variant="contained"  sx={{marginTop:"5%"}}>
            Aceptar
          </Button>
          </Box>
        <ModalCharge isLoading={isLoading} />
        <ModalDeleteSucces open={deleteRegistrationSuccess} onClose={handleCloseModal} />
        <ModalError
        open={registrationError}
        onClose={handleCloseModalError}
        error={error}
      />
        </Box>
        </Modal>
  )
}
export default ModalDialogo;