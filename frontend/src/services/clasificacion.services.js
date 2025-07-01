import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
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

const getDatosClasificacion = async () => {
  try {
    const response = await api.get('clasificacion');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getDatosCategoria = async () => {
  try {
    const response = await api.get('categorias');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneDatos = async (id) => {
  try {
    const response = await api.get(`garden/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatos = async (datos) => {
  try {
    const response = await api.post('garden', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

export { getDatosClasificacion, PostDatos, getOneDatos, getDatosCategoria };
