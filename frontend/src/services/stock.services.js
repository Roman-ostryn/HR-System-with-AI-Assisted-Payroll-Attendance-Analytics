import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
// const API_URL = getApiBaseUrl();
const API_URL = getApiBaseUrl();


// Crear una instancia de Axios
const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Configurar un interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Agregar el token al encabezado de autorización
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Funciones para manejar las solicitudes

const getDatosStock = async () => {
  try {
    const response = await api.get('stock');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getCoinvertir = async () => {
  try {
    const response = await api.get('stockCOINVERTIR');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getStockPvb = async () => {
  try {
    const response = await api.get('pvbStock');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getStockLaminado= async () => {
  try {
    const response = await api.get(`stockLaminados`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getTranslado = async () => {
  try {
    const response = await api.get('stock/translado');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

// const getOneDatos = async (id) => {
//   try {
//     const response = await api.get(`garden/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

const getOneDatos = async (serie) => {
  try {
    const response = await api.get(`getSerieStock/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getOne = async (cod_interno) => {
  try {
    const response = await api.get(`getCodInterno/${cod_interno}`);
    return response.data;
  } catch (error) {
    throw new Error('Paquete no encontrado ', error);
  }
};


const getSerieStock = async (serie) => {
  try {
    const response = await api.get(`getSerieStock/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getOneDatosTicket = async (id) => {
  try {
    const response = await api.get(`stock/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getLiberarStock= async () => {
  try {
    const response = await api.get(`${API_URL}liberarStock`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getNotaFiscalView= async () => {
  try {
    const response = await api.get(`${API_URL}notasFiscalesView`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosStock = async (datos) => {
  try {
    const response = await api.post('stock', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

const getVerifyStock = async (id) => {
  try {
    const response = await api.get(`${API_URL}stockNotaFiscal/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getVerifyStockPVB = async (id) => {
  try {
    const response = await api.get(`${API_URL}stockNotaFiscalPVB/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const putDatos = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}EntradaSalida/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

const putInter = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}intermedio/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};

const putChapas = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}updateChapas/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};

const putChapaOrden = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}updateChapaOrde/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};

const putDescuentoStock= async (id, data) => {
  try {
    const response = await api.put(`${API_URL}descontarStock/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};

const putForNote= async (data) => {
  try {
    const response = await api.put(`${API_URL}updateForNote`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};

const putEmpresa = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}updateEmpresa/${id}`, data);

    if (!response || !response.data) {
      throw new Error('La respuesta del servidor es inválida o no contiene datos.');
    }

    return response.data; // Retorna los datos correctamente actualizados
  } catch (error) {
    // Manejo detallado de errores
    if (error.response) {
      // Errores recibidos del servidor
      console.error("Error del servidor:", error.response.data.message || "Error desconocido en el servidor.");
      throw new Error(error.response.data.message || 'Ocurrió un error al actualizar los datos en el servidor.');
    } else if (error.request) {
      // Problemas con la solicitud (sin respuesta del servidor)
      console.error("Error en la solicitud:", error.request);
      throw new Error('No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.');
    } else {
      // Errores generales (en la configuración o en la lógica del cliente)
      console.error("Error general:", error.message);
      throw new Error(`Error inesperado: ${error.message}`);
    }
  }
};

export {getVerifyStock, getCoinvertir, putForNote, getStockLaminado, getNotaFiscalView, putChapaOrden, putDescuentoStock, putChapas, getStockPvb, getVerifyStockPVB, getTranslado, putInter, getOne, putDatos, getLiberarStock, getDatosStock, PostDatosStock, getOneDatos, getOneDatosTicket, getSerieStock, putEmpresa };