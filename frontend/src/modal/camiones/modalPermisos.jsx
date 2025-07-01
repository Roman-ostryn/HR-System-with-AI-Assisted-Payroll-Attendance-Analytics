import React, { useState, useEffect } from "react";
import { Box, Modal, useTheme, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// import { Formik } from "formik";
// import * as yup from "yup";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getDatos } from "../../services/level.services";
// import { createTruckState } from "../../services/trukSocket.services";
// import LoadingSpinner from "../../loadingSpinner";
// import ModalSucces from "../../modal/modalSucces";
// import ModalCharge from "../../modal/modalCharge";
// import ModalError from "../../modal/modalError";
// import ModalPermisos from "../../modal/camiones/modalPermisos";


const ModalLevel = ({ open, onClose, onSelectLevel }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1, 
      cellClassName: "name-column--cell",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await getDatos();
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
      item.descripcion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleRowDoubleClick = (params) => {
    const { id } = params.row;
    onSelectLevel(id);
    onClose();
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
            <h1 id="owner-modal-title">Buscar Nivel</h1>
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
              checkboxSelection
              rows={filteredData}
              columns={columns}
              onRowDoubleClick={handleRowDoubleClick}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
export default ModalLevel;




