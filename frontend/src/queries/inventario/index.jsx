import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getDatos } from "../../services/product.services";
import SearchIcon from "@mui/icons-material/Search";
import ModalEditWors from "../../modal/garden/modalEditWork";

const Inventario = () => {
  const [data, setData] = useState([]);
  const [modalDialogo, setModalDialogo] = useState(false);
  const [activeButton, setActiveButton] = useState(false);
  const [modalEditWorks, setModalEditWorks] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedWorks, setSelectedWorks] = useState(null);
  const [userLevel, setUserLevel] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "categoria",
      headerName: "Categoria",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "marca",
      headerName: "Marca",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "proveedor",
      headerName: "Proveedor",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cantidad_anterior",
      headerName: "Cantidad Anterior",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
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

    const level = localStorage.getItem('userLevel');
    if (level) {
      setUserLevel(parseInt(level));
    }

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

  const handleRowSelection = (newSelection) => {
    if (newSelection.length === 0) {
      setSelectedWorks(null);
      setSelectedRowIds([]);
      setActiveButton(false);
    } else {
      const selectedRowId = newSelection[newSelection.length - 1];
      setSelectedRowIds([selectedRowId]);
      const selectedRow = data.find((row) => row.id === selectedRowId);
      setSelectedWorks(selectedRow.id);
      setActiveButton(true);
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="INVENTARIO" subtitle="Registro de Inventario" />
        <Box display="flex" alignItems="center">
          {userLevel !== 2 && (
            <>
              <Button
                disabled={!activeButton}
                onClick={() => setModalEditWorks(true)}
                color="secondary"
                variant="contained"
              >
                Editar
              </Button>
              <Button
                disabled={!activeButton}
                onClick={() => setModalDialogo(true)}
                color="secondary"
                variant="contained"
                sx={{
                  backgroundColor: "#e41811",
                  color: "#ffffff",
                  marginLeft: "10px",
                }}
              >
                Eliminar
              </Button>
            </>
          )}
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"60%"}
            ml={1}
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
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
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
          "& .low-quantity-row": {
            backgroundColor: "#9a0707 !important",
          },
          "& .css-1ynv5yt .name-column--cell ": {
            color: "#000000 !important",
          },
          " & .css-1emn8ho .name-column--cell": {
            color: "#ffffff !important",
        },
        "& .css-81nvur .name-column--cell": {
             color: "#000000 !important"
         }
        }}
      >
        <DataGrid
          checkboxSelection
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowClassName={(params) =>
            params.row.cantidad <= 10 ? 'low-quantity-row' : ''
          }
          onSelectionModelChange={handleRowSelection}
          selectionModel={selectedRowIds}
          disableMultipleSelection={true}
        />
      </Box>
      <ModalEditWors
        open={modalEditWorks}
        onClose={() => setModalEditWorks(false)}
        onSelectClient={selectedWorks}
      />
    </Box>
  );
};

export default Inventario;
