import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getDatos } from "../../services/garden.services";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import ModalEditWors from "../../modal/garden/modalEditWork";
import { getResumenView } from "../../services/marcaciones.services";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as React from "react";
import dayjs from "dayjs";
import ModalCharge from "../../modal/modalCharge";
import CustomToolbar from "../../utils/CustomToolbar";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
const Resumen = () => {
  const [data, setData] = useState([]);
  const [modalDialogo, setModalDialogo] = useState(false);
  const [activeButton, setActiveButton] = useState(false);
  const [modalEditWorks, setModalEditWorks] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedWorks, setSelectedWorks] = useState(null);
  const [value, setValue] = React.useState(dayjs());
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    // { field: "Id",
    //   headerName: "ID",
    //   width: 70,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (params) => {
    //     // params.api.getRowIndex(params.id) returns zero-based index of the row
    //   const rowIndex = params.api.getRowIndex(params.id);
    //   return rowIndex + 1;}
    // },
    { field: "id_usuario", headerName: "ID_USUARIO", flex: 0.5, },
    { field: "Id_empleado", headerName: "ID_EMPLEADO", flex: 0.5, },

    {
      field: "nombre",
      headerName: "NOMBRE",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    // {
    //   field: "apellido",
    //   headerName: "APELLIDO",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    {
      field: "grupo",
      headerName: "GRUPO",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "horas",
      headerName: "HORAS TRABAJADAS",
      flex: 0.5,
      renderCell: (params) => {
        // Aseguramos que convertimos params.value a minutos
        const minutos = params.value ? convertToMinutes(params.value) : 0;
        const totalHoras = convertToTimeFormat(minutos);
        return totalHoras;
      },
    },
    {
      field: "salario",
      headerName: "SALARIO",
      flex: 0.5,
      type: "number",
      cellClassName: "name-column--cell",
    },
    {
      field: "nocturno",
      headerName: "A.Nocturno",
      flex: 0.5,
      type: "number",
      cellClassName: "name-column--cell",
    },
    {
      field: "overtime_work_price",
      headerName: "Pago Horas Extras",
      flex: 0.7,
      type: "number",
      valueFormatter: ({ value }) => value.toLocaleString('es-ES', { minimumFractionDigits: 2 }),
    },
    {
      field: "bono_familiar",
      headerName: "Bono Familiar",
      flex: 0.7,
      type: "number",
      valueFormatter: ({ value }) => value.toLocaleString('es-ES', { minimumFractionDigits: 2 }),
    }, 
    {
      field: "bono_produccion",
      headerName: "Bono Producción",
      flex: 0.7,
      type: "number",
      valueFormatter: ({ value }) => value.toLocaleString('es-ES', { minimumFractionDigits: 2 }),
    },
    {
      field: "ips",
      headerName: "IPS",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "adelanto_deduction",
      headerName: "Adelanto",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "descuento",
      headerName: "DESCUENTO",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },

    {
      field: "total",
      headerName: "TOTAL A PAGAR",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    }
  ];
  useEffect(() => {
    // Activa el estado de carga a 'true'
    setIsLoading(true);

    // Después de 3 segundos, cambia el estado a 'false'
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Limpia el temporizador en caso de que el componente se desmonte
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  const handleRowSelection = (newSelection) => {
    if (newSelection.length === 0) {
      setSelectedWorks(null);
      setSelectedRowIds([]);
      setActiveButton(false);
    } else {
      const selectedRowId = newSelection[newSelection.length - 1];
      setSelectedRowIds([selectedRowId]);
      const selectedRow = data.find((row) => row.Id === selectedRowId);
      setSelectedWorks(selectedRow.Id);
      setActiveButton(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Format dates for backend
        const formattedStart = startDate.format('YYYY-MM-DD');
        const formattedEnd = endDate.format('YYYY-MM-DD');
        
        const datos = await getResumenView(formattedStart, formattedEnd);
        console.log("data:", datos);
        const mappedData = datos.map((row) => ({
          id_usuario: row.id,
          Id_empleado: row.id_empleado,
          nombre: `${row.firstname} ${row.lastname}`,
          grupo: row.grupo_descripcion || "Desconocido",
          horas: row.horas || "0:00",
          salario: Number(row.salario_monto) || 0,
          nocturno: row.nocturno || 0,
          descuento: Number(row.total_descuento) || 0, // map total_descuento here
          adelanto_deduction: Number(row.adelanto_deduction) || 0, // map adelanto deduction
          ips: Number(row.ips) || 0,
          total: Number(row.total_pay) || 0,
          overtime_work_price: Number(row.overtime_work_price) || 0,
          bono_familiar: Number(row.bono_familiar) || 0,
          bono_produccion: Number(row.bono_produccion) || 0,
        }));
        
        setOriginalData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [startDate, endDate]); // Re-fetch when dates change
 
  useEffect(() => {
    if (originalData.length > 0) {
      // Apply only search filter
      const searchFiltered = originalData.filter((item) =>
        item.nombre.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(searchFiltered);
    }
  }, [searchValue, originalData]); 

  const convertToMinutes = (time) => {
    if (!time) return 0;
  
    // Trim spaces
    const trimmed = time.toString().trim();
  
    // Check if trimmed is a pure number string (all digits)
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
  
    // Otherwise assume "HH:mm" format
    const [hours, minutes] = trimmed.split(":").map((num) => parseInt(num, 10) || 0);
    return hours * 60 + minutes;
  };

  const convertToTimeFormat = (minutes) => {
    if (isNaN(minutes) || minutes < 0) {
      return "0:00";
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // Pad minutes with leading zero if needed
    const paddedMins = mins.toString().padStart(2, "0");
    return `${hours}:${paddedMins}`;
  };

const handleExport = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Resumen');

  // Agregar las columnas con encabezados
  worksheet.columns = [
      { header: 'Nombre y Apellido', key: 'nombre', width: 20 },
      { header: 'Sector', key: 'sector', width: 15 },
      { header: 'Salario', key: 'salario', width: 10 },
      { header: 'A.Nocturno', key: 'nocturno', width: 12 },
      { header: 'IPS', key: 'ips', width: 10 },
      { header: 'Descuento', key: 'descuento', width: 12 },
      { header: 'Total a Pagar', key: 'total', width: 15 },
  ];

  // Agregar datos al worksheet
  const exportableData = filteredData.map((row) => {
      const { nombre, grupo, salario, nocturno, descuento } = row;
      const salarioNum = parseFloat(salario) || 0;
      const nocturnoNum = parseFloat(nocturno) || 0;
      const descuentoNum = parseFloat(descuento) || 0;

      const xsalario = salarioNum + nocturnoNum;
      const xips = xsalario * 0.09;

      return {
          nombre,
          sector: grupo,
          salario: salarioNum.toLocaleString('es-ES'),
          nocturno: nocturnoNum.toLocaleString('es-ES'),
          ips: xips.toLocaleString('es-ES'),
          descuento: descuentoNum.toLocaleString('es-ES'),
          total: (xsalario - (xips + descuentoNum)).toLocaleString('es-ES'),
      };
  });

  worksheet.addRows(exportableData);

  // Aplicar estilos a las cabeceras
  worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '143f04' },

      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' }, 
    };
      cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
  });

  // Aplicar bordes a todas las celdas con datos
  worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
          };
      });
  });

  // Guardar el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Resumen_Asistencia.xlsx';
  link.click();
};

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Resumen para Pagos"
          subtitle="Resumen de Asistencia para Pagos"
        />
        <Box display="flex" alignItems="center">
        
  <Box sx={{
    marginRight:"2%",
    marginLeft:"2%",

  }}>
              
              <Button sx={{
                background:"#143f04",
                width:"100%",
                height:"3rem!important",
                color:"white",
                borderRadius:"8px", "&:hover": {
                  background: "#36a60f", // Color de fondo cuando el botón está en hover
                },
                
              }} onClick={handleExport} variant="contained" color="primary">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="Excel Icon"
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                Exportar
              </Button>
              </Box>
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"50%"}
            width={"100%"}
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
          overflowY: 'auto',
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "-1%",
            marginRight: "5px",
          }}
        >
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Fecha de Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(dayjs(newValue))}
                  format="DD/MM/YYYY"
                />
                <DatePicker
                  label="Fecha de Fin"
                  value={endDate}
                  onChange={(newValue) => setEndDate(dayjs(newValue))}
                  format="DD/MM/YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <DataGrid
          loading={isLoading}
          rows={filteredData}
          columns={columns}
          getRowId={(row, index) =>
            `${row.id_usuario}-${row.Id}-${row.Id_empleado}-${index}`
          } // Incluyendo el índice
          // components={{ Toolbar: GridToolbar }}
          components={{ Toolbar: CustomToolbar }}
          // onSelectionModelChange={handleRowSelection}
          selectionModel={selectedRowIds}
          disableMultipleSelection={false}
          pagination
          pageSize={100}
          rowsPerPageOptions={[100]}
          autoHeight={false}
        />
      </Box>
      <ModalEditWors
        open={modalEditWorks}
        onClose={() => setModalEditWorks(false)}
        onSelectClient={selectedWorks}
      />
      <ModalCharge isLoading={isLoading} />
    </Box>
  );
};

export default Resumen;
