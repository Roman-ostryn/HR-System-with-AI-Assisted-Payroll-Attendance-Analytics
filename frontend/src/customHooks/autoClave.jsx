import { useEffect, useRef } from "react";
import { getDatosHistorial } from "../../src/services/autoClave.services"; // Asegúrate de que el path sea correcto

const useFetchDataPeriodically = (interval = 60000) => {
  const intervalIdRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await getDatosHistorial(); // Llamar a tu función
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a la función inmediatamente al montar el componente

    intervalIdRef.current = setInterval(fetchData, interval); // Configura el intervalo para cada 1 minuto (60000 ms)

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current); // Limpia el intervalo al desmontar el componente
      }
    };
  }, [interval]); // La dependencia `interval` te permite configurar el tiempo de ejecución

  return null; // Este hook no necesita renderizar nada
};

export default useFetchDataPeriodically;
