

import { useEffect, useState } from 'react';

const useNumeroSeleccionada = (initialNumero = null) => {
  const [numeroSeleccionada, setNumeroSeleccionada] = useState(initialNumero || 24);

  useEffect(() => {
  }, [numeroSeleccionada]);

  return { 
    numeroSeleccionada, 
    setNumeroSeleccionada 
  };
};

export default useNumeroSeleccionada;