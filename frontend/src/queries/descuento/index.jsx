import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getDescuento } from "../../services/descuento.services";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DescuentoView = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userLevel, setUserLevel] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Columnas de la tabla
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "Id_Empleado",
      headerName: "Empleado",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Nombre",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Apellido",
      headerName: "Apellido",
      flex: 1,
      type: "string",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "descripcion_descuento",
      headerName: "Descripcion",
      flex: 1,
      type: "string",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Monto",
      headerName: "Monto",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Fecha",
      headerName: "Fecha",
      flex: 1,
      type: "string",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => params.value ? dayjs(params.value).format("DD/MM/YYYY") : "",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDescuento();
        const filteredResponseData = response.filter(item => item.id_descuento !== 3);
        setData(filteredResponseData);
        setFilteredData(filteredResponseData);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    const level = localStorage.getItem("userLevel");
    if (level) {
      setUserLevel(parseInt(level));
    }

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    const filtered = data.filter((item) =>
      item.Nombre.toLowerCase().includes(value.toLowerCase()) &&
      dayjs(item.Fecha).isSame(startDate, 'day')
    );

    setFilteredData(filtered);
  };

  const handleDateChange = (newValue) => {
    const newDate = dayjs(newValue);
    setStartDate(newDate);

    const filtered = data.filter((item) =>
      item.Nombre.toLowerCase().includes(searchValue.toLowerCase()) &&
      dayjs(item.Fecha).isSame(newDate, 'day')
    );

    setFilteredData(filtered);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Relatorio de Descuentos" subtitle="Relatorio de Descuentos" />
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"90%"}
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
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "0.5%"
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Filtrar Por Fecha"
              value={startDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <Box
        m="0px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          marginTop: "-1.5%",
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
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
        />
      </Box>
    </Box>
  );
};

export default DescuentoView;
