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

const getResumenView = async (startDate, endDate) => {
  try {
    const response = await api.get(`${API_URL}marcacion/ResumenView`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
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

const PostDatos = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}garden`, datos);
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

const saveOvertimeActivation = async (id_marcacion, approval) => {
  try {
    const response = await api.post(`${API_URL}marcacion/setapprove`, {
      id_marcacion,
      aprobacion_horas_extras: approval, // use the correct field name expected by backend
    });
    return response.data;
  } catch (error) {
    // Throw error with message and original error info
    throw new Error(`Error al obtener datos del backend: ${error.message || error}`);
  }
};

export { getResumenView, getPlusView, PostDatos, getOneDatos, getListTruckView, getMarcacionesView, saveOvertimeActivation};
