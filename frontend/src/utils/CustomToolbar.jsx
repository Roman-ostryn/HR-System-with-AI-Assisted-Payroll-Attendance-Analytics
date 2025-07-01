import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useEffect } from "react";




const CustomToolbar = ({ filteredDat, setFilteredDat }) => {
  const apiRef = useGridApiContext();

  // useEffect(() => {
  // }, [filteredDat]);



  const handleExportClick = () => {
   
    // handleExport();
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {/* <Button startIcon={<PictureAsPdfIcon />} onClick={handleExportClick}>
        Generar Pdf
      </Button> */}
      {/* <GridToolbarExport
        csvOptions={{
          allColumns: true, // Exporta todas las columnas, incluidas las ocultas.
          fileName: "Resumen_Completo", // Nombre del archivo.
        }}
        printOptions={{
          allColumns: true, // Exporta todas las columnas para imprimir.
        }}
      /> */}
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
