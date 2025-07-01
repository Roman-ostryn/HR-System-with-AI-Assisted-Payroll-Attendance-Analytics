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

const getDatosReceta = async () => {
  try {
    const response = await api.get(`${API_URL}receta`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getListTruckView = async () => {
  try {
    const response = await api.get('truck/listTruckView');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend: ' + error.message);
  }
};

const getOneReceta = async (id) => {
  try {
    const response = await api.get(`${API_URL}receta/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosReceta = async (datos) => {
  try {
    const response = await api.post('receta', datos);
    return response.data;

  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Si el error es una respuesta del servidor con un mensaje de error
      throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
    } else {
      // Si el error no es una respuesta del servidor con un mensaje de error
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

export { getDatosReceta, PostDatosReceta, getOneReceta, getListTruckView };