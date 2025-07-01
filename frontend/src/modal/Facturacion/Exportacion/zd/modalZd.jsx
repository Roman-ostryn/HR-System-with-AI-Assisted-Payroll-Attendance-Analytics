import React, { useState, useEffect } from "react";
import { Box,Button, Modal, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { getDatos } from "../../../../services/cliente.services";
import { getDatosExportacion } from "../../../../services/exportacion.services";


const ModalZd = ({ open, onClose, onSelect}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [

    {
      field: "senores",
      headerName: "Señores/Mister",
      flex: 2, 
      cellClassName: "name-column--cell",
    },
    { field: "direccion", headerName: "Direccion", flex: 1 },
    { field: "CNPJ", headerName: "CNPJ", flex: 1, cellClassName: "name-column--cell",},

    { field: "telefono", headerName: "Telefono", flex: 1 },
    { field: "pais", headerName: "Pais", flex: 1, cellClassName: "name-column--cell"},
    { field: "ciudad", headerName: "Ciudad", flex: 1 },
    { field: "puerto", headerName: "Puerto", flex: 1 },
    { field: "aduana", headerName: "Aduana", flex: 1 },
    { field: "transporte", headerName: "Transporte", flex: 1 },

  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await getDatosExportacion();
        setData(datos);
        setFilteredData(datos);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };
    
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    const filtered = data.filter((item) =>
      item.senores.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleRowClick = (params) => {
    const selected = params.row; // Obtiene toda la fila
    onSelect(selected); // Envía los datos del usuario seleccionado
    onClose(); // Cierra el modal
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="registration-success-modal-title"
      aria-describedby="registration-success-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          paddingLeft: "10px",
          paddingTop: "5px",
          paddingRight: "10px",
          paddingBottom: "10px!important",
          zIndex: 1500,
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="owner-modal-title">Seleccione un Cliente</h1>
            <Box
              display="flex"
              backgroundColor={colors.primary[400]}
              borderRadius="3px"
              height={"40%"}
              width={"40%"}
              marginTop={"3%"}
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
          <Box
            m="10px 0"
            height="70vh"
            width="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: colors.greenAccent[300] },
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
            }}
          >
            <DataGrid
              // checkboxSelection
              rows={filteredData}
              columns={columns}
              onRowClick={handleRowClick}
            />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" onClick={onClose}>
                Cerrar
              </Button>
            {/* </Box> */}
          </Box>
        </Box>
      </Box>
      
    </Modal>
  );
};
export default ModalZd;




