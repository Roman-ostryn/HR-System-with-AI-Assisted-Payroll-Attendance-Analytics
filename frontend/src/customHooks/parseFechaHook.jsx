
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const useFechaSeleccionada = (initialFecha = null) => {
  // Inicializar con la fecha pasada o con `dayjs()` si no se pasa ninguna.
  const [fechaSeleccionada, setFechaSeleccionada] = useState(initialFecha || dayjs());

  useEffect(() => {
    // Solo imprimimos para verificar el cambio
  }, [fechaSeleccionada]);

  console.log('Fecha seleccionada:', fechaSeleccionada.format('YYYY-MM-DD'));

  // Retornar la fecha formateada, pero también el setter para la fecha
  return { 
    fechaSeleccionada: fechaSeleccionada.format('YYYY-MM-DD'), 
    setFechaSeleccionada 
  };
};

export default useFechaSeleccionada;


// import { useState, useEffect } from 'react';
// import dayjs from 'dayjs';

// const useFechaSeleccionada = (initialFecha = null, endFecha = null) => {
//   const [fechaInicio, setFechaInicio] = useState(initialFecha ? dayjs(initialFecha) : dayjs());
//   const [fechaFin, setFechaFin] = useState(endFecha ? dayjs(endFecha) : dayjs());

//   useEffect(() => {
//     // Solo para debug
//     console.log('Fecha inicio:', fechaInicio.format('YYYY-MM-DD'));
//     console.log('Fecha fin:', fechaFin.format('YYYY-MM-DD'));
//   }, [fechaInicio, fechaFin]);

//   return {
//     fechaInicio: fechaInicio.format('YYYY-MM-DD'),
//     setFechaInicio,
//     fechaFin: fechaFin.format('YYYY-MM-DD'),
//     setFechaFin,
//   };
// };

// export default useFechaSeleccionada;
