import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
// const API_URL = getApiBaseUrl();
const API_URL = getApiBaseUrl();


// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_URL,
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

const getEntradaNotaFiscal = async () => {
  try {
    const response = await api.get('entradaNotaFiscal');
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
    const response = await api.get(`${API_URL}getOneSerie/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getSerieEntradaNotaFiscal = async (serie) => {
  try {
    const response = await api.get(`${API_URL}EntradaNotaFiscal/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


// const getOneDatosTicket = async (id) => {
//   try {
//     const response = await api.get(`entradaNotaFiscal/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

const getOneDatosTicket = async (id) => {
  try {
    const response = await api.get(`stockNotaFiscal/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneNota = async (nota) => {
  try {
    const response = await api.get(`notaFiscal/${nota}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const PostDatos = async (datos) => {
  try {
    const response = await api.post('entradaNotaFiscal', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(''+ error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

const PostDatosPVB = async (datos) => {
  try {
    const response = await api.post('notafiscal/pvb', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(''+ error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

const putEntradaNotaFiscal= async (id, data) => {
  try {
    const response = await api.put(`${API_URL}entradaNotaFiscal/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};

const ActualizarEntradaNotaFiscal= async ( data) => {
  try {
    const response = await api.put(`${API_URL}ActualizarNotaFiscal`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ', error.message);
  }
};



export { PostDatosPVB, ActualizarEntradaNotaFiscal, putEntradaNotaFiscal, getEntradaNotaFiscal, PostDatos, getOneDatos, getOneDatosTicket, getSerieEntradaNotaFiscal, getOneNota };