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


const getMetasView = async () => {
  try {
    const response = await api.get(`${API_URL}metas/metasView`);
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

const getPlusView = async () => {
  try {
    const response = await api.get(`${API_URL}sanciones/sancionesView`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getMarcacionesView = async () => {
  try {
    const response = await api.get(`${API_URL}marcacion/MarcacionView `);
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

const getOneDatos = async (id) => {
  try {
    const response = await axios.get(`${API_URL}garden/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosMetas = async (datos) => {
  try {
    const response = await api.post(`metas`, datos);
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

export { getMetasView, getPlusView, PostDatosMetas, getOneDatos, getListTruckView, getMarcacionesView};
