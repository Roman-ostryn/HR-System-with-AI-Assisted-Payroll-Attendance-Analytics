import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import { getMarcacionesView } from "../../../services/marcaciones.services";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as React from "react";
import dayjs from "dayjs";
import ModalCharge from "../../../modal/modalCharge";
import ExcelJS from 'exceljs';


const ListaMarcaciones = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null); // Iniciar con null
  const [endDate, setEndDate] = useState(null); // Iniciar con null
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "Id", headerName: "ID" },
    { field: "id_usuario", headerName: "ID_USUARIO" },
    { field: "Id_empleado", headerName: "ID_EMPLEADO" },
    // {
    //   field: "nombre",
    //   headerName: "NOMBRE",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    // {
    //   field: "apellido",
    //   headerName: "APELLIDO",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    {
      field: "funcionario",
      headerName: "NOMBRE",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "grupo",
      headerName: "GRUPO",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "horas",
      headerName: "HORAS TRABAJADAS",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "entrada",
      headerName: "Entrada",
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), "HH:mm:ss") : "0",
    },
    {
      field: "salida_almuerzo",
      headerName: "Salida Almuerzo",
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), "HH:mm:ss") : "0",
    },
    {
      field: "entrada_almuerzo",
      headerName: "Entrada Almuerzo",
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), "HH:mm:ss") : "0",
    },
    {
      field: "salida",
      headerName: "Salida",
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), "HH:mm:ss") : "0",
    },
    {
      field: "Fecha",
      headerName: "FECHA",
      flex: 1,
      renderCell: (params) => params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await getMarcacionesView();
        setOriginalData(datos);
        setData(datos);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const filterByDateRange = () => {
      let filtered = originalData;
  
      if (startDate && endDate) {
        // Aseguramos que la fecha de fin sea hasta el final del día
        const endOfDay = dayjs(endDate).endOf("day");
  
        filtered = originalData.filter((item) => {
          const itemDate = dayjs(item.Fecha);
          // Filtrar desde la fecha de inicio hasta el final del día de la fecha de fin
          return itemDate.isBetween(startDate, endOfDay, null, "[]");  // "[]" hace que sea inclusivo en ambas fechas
        });
      }
  
      const searchFiltered = filtered.filter((item) =>
        item.funcionario.toLowerCase().includes(searchValue.toLowerCase())
      );
  
      setData(searchFiltered);
    };
  
    filterByDateRange();
  }, [startDate, endDate, searchValue, originalData]);

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen');
  
    // Agregar las columnas con encabezados
    worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Apellido', key: 'apellido', width: 20 },
        { header: 'Sector', key: 'sector', width: 15 },
        { header: 'Entrada', key: 'entrada', width: 10 },
        { header: 'Salida Almuerzo', key: 'salida_almuerzo', width: 12 },
        { header: 'Entrada Almuerzo', key: 'entrada_almuerzo', width: 10 },
        { header: 'Salida', key: 'salida', width: 12 },
        { header: 'Fecha', key: 'fecha', width: 15 },
    ];
  
    // Agregar datos al worksheet
    const exportableData = data.map((row) => {
        const { 
            nombre, 
            apellido, 
            grupo, 
            entrada, 
            salida_almuerzo, 
            entrada_almuerzo, 
            salida, 
            Fecha 
        } = row;

        return {
            nombre: nombre || 'Sin Registro', // Si el dato es null o undefined
            apellido: apellido || 'Sin Registro',
            sector: grupo || 'Sin Registro',
            entrada: entrada ? dayjs(entrada).format('HH:mm:ss') : 'Sin Registro',
            salida_almuerzo: salida_almuerzo ? dayjs(salida_almuerzo).format('HH:mm:ss') : '0',
            entrada_almuerzo: entrada_almuerzo ? dayjs(entrada_almuerzo).format('HH:mm:ss') : '0',
            salida: salida ? dayjs(salida).format('HH:mm:ss') : '0',
            fecha: Fecha ? dayjs(Fecha).format('DD/MM/YYYY') : '0',
        };
    });

    worksheet.addRows(exportableData);

    // Aplicar estilos a las cabeceras
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = {
            bold: true,
            color: { argb: 'FFFFFF' },
        };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '143f04' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    // Revisar datos y aplicar estilos solo a las celdas con valores inválidos
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Saltar la cabecera

        let rowHasInvalidData = false; // Flag para verificar si la fila tiene datos inválidos

        row.eachCell((cell) => {
            // Si el valor es 'Sin Registro' (lo que indica que el dato es inválido)
            if (cell.value === '0') {
                rowHasInvalidData = true; // Marcar que la fila tiene un dato inválido
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0000' }, // Fondo rojo
                };
                cell.font = { color: { argb: 'FFFFFF' } }; // Texto blanco
            }

            // Aplicar bordes a todas las celdas
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Si la fila tiene algún dato inválido, poner fondo rojo en toda la fila
        if (rowHasInvalidData) {
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0000' }, // Fondo rojo
                };
            });
        }
    });

    // Guardar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Resumen_Asistencia.xlsx';
    link.click();
};

  // Función para asignar una clase a cada fila dependiendo del Estado
  const getRowClassName = (params) => {
    const salida = params.row.salida;
    
    // Si salida es null, 0 o "0", asignar la clase para la fila
    if (!salida || salida === "0" || salida === 0) {
      return "fila-invalida"; // Nombre de clase personalizada para filas inválidas
    }
    
    return ""; // Sin clase para las filas que no cumplen la condición
  };

  
  return (
    <Box m="20px">
    <Box display="flex" justifyContent="space-between" p={0}>
      <Header
        title="Resumen de Asistencias"
        subtitle="Resumen de Asistencia "
      />
      <Box display="flex" alignItems="center">
        {/* <Button
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
            color: "#ffffff ",
            marginLeft: "10px",
          }}
        >
          Eliminar
        </Button> */}
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
          borderBottom:"0.5px solid #5f5d5d",
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

          // Estilos para las filas con hover
          "& .fila-invalida": {
            backgroundColor: "#740017", // Fondo rojo
            color: "#FFFFFF", // Texto blanco
            // borderBottom:"0.5px solid #5f5d5d",
            "&:hover": {
              backgroundColor: "#CC0000", // Fondo más oscuro al pasar el ratón
            },
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
          rows={data}
          columns={columns}
          getRowId={(row) => `${row.Id}_${row.id_usuario}`}
          getRowClassName={getRowClassName}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <ModalCharge isLoading={isLoading} />
    </Box>
  );
};

export default ListaMarcaciones;