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
import { getAguinaldoIpsView } from "../../services/pagos.services";
const AguinaldoIps = () => {
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
    { field: "id", headerName: "ID" },
    { field: "id_usuario", headerName: "ID_USUARIO" },
    {
      field: "Funcionario",
      headerName: "NOMBRE",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "cedula",
      headerName: "Cedula",
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
      field: "ips",
      headerName: "Salario Ips",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        const ipsx = params.row.ips ;
        return ipsx.toLocaleString();
      },
    },
    {
      field: "salario_ips",
      headerName: "Salario Pagado",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        const salarioips = Number(params.row.salario_ips) || 0;
       
        return salarioips.toLocaleString();
      },
    },
    {
      field: "total_a_pagar",
      headerName: "Aguinaldo",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        const total = params.row.total_a_pagar || 0;
        return total.toLocaleString();
      },
    },
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
      setIsLoading(true);
      try {
        const datos = await getAguinaldoIpsView();
        setOriginalData(datos);
        const groupedData = agruparYCalcularDatos(datos);
        setFilteredData(groupedData); // Inicializa los datos agrupados y calculados
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // const fetchData = async () => {
    //   const datos = await getAguinaldoIpsView();
    //   const enhancedData = datos.map((row) => ({
    //     ...row,
    //     ips: (Number(row.salario || 0) + Number(row.nocturno || 0)) * 0.09,
    //     total: (Number(row.salario || 0) + Number(row.nocturno || 0)) -
    //            ((Number(row.salario || 0) + Number(row.nocturno || 0)) * 0.09 + 
    //             Number(row.descuento || 0)),
    //   }));
    //   setOriginalData(enhancedData);
    // };
    fetchData();
  }, []);

  useEffect(() => {
    const filterByDateRange = () => {
      if (!startDate || !endDate) return;
      const endOfDay = dayjs(endDate).endOf("day");
      const filtered = originalData.filter((item) => {
        const itemDate = dayjs(item.Fecha);
        return itemDate.isBetween(startDate, endOfDay, null, "[]");
      });
      const searchFiltered = filtered.filter((item) =>
        item.Funcionario.toLowerCase().includes(searchValue.toLowerCase())
      );
      const calculatedData = agruparYCalcularDatos(searchFiltered);
      setFilteredData(calculatedData);
    };
    filterByDateRange();
  }, [startDate, endDate, searchValue, originalData]);

  const agruparYCalcularDatos = (datos) => {
    return datos.reduce((acc, current) => {
      const salario = Number(current.salario_ips) || 0;
      const existing = acc.find((item) => item.id_usuario === current.id_usuario);
  
      if (existing) {
        // Sumar salario si el usuario ya existe en el acumulador
        existing.salario_ips += salario;
      } else {
        // Añadir un nuevo registro con el salario inicial
        acc.push({ ...current, salario_ips: salario });
      }
  
      return acc;
    }, [])
    .map((item) => ({
      ...item,
      total_a_pagar: item.salario_ips / 12, // Agregar el cálculo directamente
    }));
  };



  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen');
  
    // Definir las columnas con encabezados
    worksheet.columns = [
        { header: 'Nombre y Apellido', key: 'Funcionario', width: 20 },
        { header: 'Cédula', key: 'cedula', width: 12 },
        { header: 'Sector', key: 'sector', width: 15 },
        { header: 'Salario IPS', key: 'ips', width: 15 },
        { header: 'Salario Pagado', key: 'salario_ips', width: 15 },
        { header: 'Aguinaldo', key: 'total_a_pagar', width: 15 },
    ];
  
    // Preparar los datos a exportar
    const exportableData = filteredData.map((row) => {
        const { Funcionario, grupo, ips, cedula, total_a_pagar, salario_ips } = row;
        
        return {
            Funcionario,
            cedula: cedula.toLocaleString('es-ES'),
            sector: grupo,
            ips: ips,
            salario_ips: salario_ips.toLocaleString('es-ES'),
            total_a_pagar: total_a_pagar.toLocaleString('es-ES'),
        };
    });
  
    worksheet.addRows(exportableData);
  
    // Aplicar estilos a las cabeceras
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
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
  
    // Aplicar bordes a todas las celdas con datos
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) { // Saltar las cabeceras
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        }
    });
  
    // Exportar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Resumen_Aguinaldo.xlsx';
    link.click();
  };
  


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Resumen Aguinaldo IPS"
          subtitle="Resumen Aguinaldo IPS"
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
          {/* <Box>
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
          </Box> */}
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

export default AguinaldoIps;
