import React, { useState, useEffect } from "react";
import { saveOvertimeActivation } from "../../services/marcaciones.services";
import {
  Box,
  InputBase,
  IconButton,
  Switch,
  Typography,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getHorasExtrasView } from "../../services/horasExtras.services";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const HorasExtras = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(dayjs().subtract(30, "day"));
  const [endDate, setEndDate] = useState(dayjs());

  // Track switch enabled state per row, keyed by id_marcacion
  const [rowSettings, setRowSettings] = useState({});

  // Snackbar state for toast notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHorasExtrasView(
          startDate.format("YYYY-MM-DD"),
          endDate.format("YYYY-MM-DD")
        );
        console.log("data:", response)
        setData(response);
        setFilteredData(response);
        
        // Initialize switch states based on 'aprobación_horas_extras' field from fetched data
        const initialSettings = {};
        response.forEach((row) => {
          initialSettings[row.id_marcacion] = { enabled: row.aprobación_horas_extras === 1 };
        });
        setRowSettings(initialSettings);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
        setSnackbarMessage("Error al cargar los datos.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    const filtered = data.filter((item) =>
      item.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSwitchChange = (id_marcacion) => async (event) => {
    const isChecked = event.target.checked;
    const newApproval = isChecked ? 1 : 0;
  
    try {
      await saveOvertimeActivation(id_marcacion, newApproval);
  
      setRowSettings((prev) => ({
        ...prev,
        [id_marcacion]: { enabled: isChecked },
      }));
  
      setSnackbarMessage(
        isChecked
          ? "Agregado exitosamente al pago"
          : "Removido exitosamente del pago"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating overtime approval:", error);
      setSnackbarMessage("Error al actualizar la aprobación");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const columns = [
    { field: "id_marcacion", headerName: "ID", flex: 0.5 },
    { field: "empleado", headerName: "ID Empleado", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "grupo", headerName: "Grupo", flex: 1 },
    { field: "horas", headerName: "Horas", flex: 1 },
    {
      field: "prohibido",
      headerName: "Entrada",
      flex: 1,
      renderCell: (params) =>
        params.value ? format(new Date(params.value), "HH:mm:ss") : "",
    },
    {
      field: "salida",
      headerName: "Salida",
      flex: 1,
      renderCell: (params) =>
        params.value ? format(new Date(params.value), "HH:mm:ss") : "",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      renderCell: (params) =>
        params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
    {
      field: "descripcion_horas_extras",
      headerName: "Tipo Horas Extras",
      flex: 1,
      renderCell: (params) => {
        const id_marcacion = params.row.id_marcacion;
        const enabled = rowSettings[id_marcacion]?.enabled || false;
        const description = params.value || "Desconocido";
        return (
          <Typography
            sx={{
              fontWeight: enabled ? "bold" : "normal",
              color: enabled ? colors.greenAccent[400] : "inherit",
              cursor: "default",
            }}
          >
            {description}
          </Typography>
        );
      },
    },
    {
      field: "approve_switch",
      headerName: "Activo para Pago",
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const id_marcacion = params.row.id_marcacion;
        const enabled = rowSettings[id_marcacion]?.enabled || false;
        return (
          <Switch
            checked={enabled}
            onChange={handleSwitchChange(id_marcacion)}
            color="primary"
          />
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={0}
        mb={2}
      >
        <Header
          title="Registros de Horas Extras"
          subtitle="Horas Extras Habilitadas"
        />

        <Box display="flex" alignItems="center" gap={2}>
          {/* Search Bar */}
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height="40px"
            width="300px"
            alignItems="center"
            px={1}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Date Pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" gap={2}>
              <DatePicker
                label="Fecha de Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label="Fecha de Fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small" } }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Box>

      <Box
        height="75vh"
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData}
          getRowId={(row) => row.id_marcacion}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HorasExtras;