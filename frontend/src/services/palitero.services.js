import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
const API_URL = getApiBaseUrl();
// const API_URL = getApiBaseUrl();


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

const getDatosInterfolacion = async () => {
  try {
    const response = await api.get('interfoliacion');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getDatosPalitero = async (id) => {
  try {
    const response = await api.get(`palitero/viewPalitero/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getCaballetePal = async () => {
  try {
    const response = await api.get('palitero/getPaliteroCab');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getIdColarPalitero = async (id) => {
  try {
    const response = await api.get(`palitero/idColar/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getIdColarPReprint = async (id) => {
  try {
    const response = await api.get(`palitero/idColarRep/${id}`);
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
    throw new Error(`Serie: ${serie} aun no a sido registrado`, error);
  }
};

const getOneImpresion = async (serie) => {
  try {
    const response = await api.get(`${API_URL}getOneSerieImpresion/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneDatosTicket = async (id_produccion) => {
  try {
    const response = await api.get(`interfoliacion/${id_produccion}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosInterfolacion = async (datos) => {
  try {
    const response = await api.post('interfoliacion', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend2: ' + error.message);
    }
  }
};

export { getDatosInterfolacion, getIdColarPalitero, getDatosPalitero, PostDatosInterfolacion, getOneDatos, getOneDatosTicket, getOneImpresion, getCaballetePal, getIdColarPReprint };