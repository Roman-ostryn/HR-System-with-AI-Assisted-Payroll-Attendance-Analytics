import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

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

const getDatos = async () => {
  try {
    const response = await axios.get(`${API_URL}owner`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};
const getOneDatos = async (id) => {
  try {
    const response = await axios.get(`${API_URL}owner/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatos = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}owner`, datos);
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

const putDatos = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}owner/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

const DeleteDatos = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}owner/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Hubo un Error al Intentar Eliminar los datos: ');
  }
};

export { PostDatos, getDatos, getOneDatos, putDatos, DeleteDatos };
