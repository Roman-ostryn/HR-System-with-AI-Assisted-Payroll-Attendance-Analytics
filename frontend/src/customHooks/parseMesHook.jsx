


// import { useState, useEffect } from 'react';
// import dayjs from 'dayjs';

// const useMesSeleccionada = (initialFecha = null, endFecha = null) => {
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

// export default useMesSeleccionada;
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const useMesseleccionada = (initialFecha = null, endFecha = null) => {
  const [fechaInicio, setFechaInicio] = useState(initialFecha ? dayjs(initialFecha) : dayjs());
  const [fechaFin, setFechaFin] = useState(endFecha ? dayjs(endFecha) : dayjs());
  const [elVerdadero, setElVerdadero] = useState({
    fechaInicio: fechaInicio.format('YYYY-MM-DD'),
    fechaFin: fechaFin.format('YYYY-MM-DD')
  });

  useEffect(() => {
    setElVerdadero({
      fechaInicio: fechaInicio.format('YYYY-MM-DD'),
      fechaFin: fechaFin.format('YYYY-MM-DD')
    });
  }, [fechaInicio, fechaFin]);

  return {
    elVerdadero,
    setFechaInicio,
    setFechaFin,
  };
};

export default useMesseleccionada;
// console.log("el verdadero desde pastel:",elVerdadero);