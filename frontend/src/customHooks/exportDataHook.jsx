
import { useEffect, useState } from 'react';


const ExportData = () => {
 
  // Inicializar con la fecha pasada o con `dayjs()` si no se pasa ninguna.
  const [filteredDat, setFilteredDat] = useState([]);

  useEffect(() => {
    // Solo imprimimos para verificar el cambio
  
  }, [filteredDat]);

  
  // Retornar 
  return { 
    filteredDat, 
    setFilteredDat 
  };
};

export default ExportData;