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

const getDatosPvb = async () => {
  try {
    const response = await api.get('pvb');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneDatos = async (id) => {
  try {
    const response = await api.get(`stockPvb/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatos = async (datos) => {
  try {
    const response = await api.post('pvb', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

const getVerificarPvb = async (cod) => {
  try {
    const response = await api.get(`${API_URL}verificarPvb/${cod}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOnePvb = async (cod) => {
  try {
    const response = await api.get(`${API_URL}pvb/${cod}`);

    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const updateRegistro = async (orden, data) => {
  try {
    const response = await api.put(`${API_URL}ordenProduccion/${orden}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error("Estado del error:", error.response.status); // Estado del error (e.g., 404, 500)
      console.error("Datos del error:", error.response.data); // Datos del error devueltos por el servidor
    } else if (error.request) {
      // No se recibió respuesta
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      // Error al configurar la solicitud
      console.error("Error en la solicitud:", error.message);
    }
    throw new Error('Error al obtener datos del backend');
  }
};


const putDatos = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}pvbMedida/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

export {getOnePvb, getDatosPvb, PostDatos, getOneDatos, getVerificarPvb, updateRegistro, putDatos};
