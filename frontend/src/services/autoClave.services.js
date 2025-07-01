import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
const API_URL = getApiBaseUrl();
console.log("🚀 ~ API_URL:", API_URL)

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

const getDatosAutoClave = async () => {
  try {
    const response = await api.get(`${API_URL}autoClave`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getAutoClavebyNumber = async (numero) => {
    try {
      const response = await api.post('logAutoclave/', {numero});
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener datos del backend:', error);
    }
  };

const getDatosLog = async () => {
  try {
    const response = await api.get(`${API_URL}autoClaveLog`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getDatosLogDes = async () => {
  // console.log("🚀 ~ getDatosLogDes ~ API_URL:", API_URL)
  try {
    const response = await api.get(`autoClaveLogDesc`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getDatosHistorial = async () => {
  try {
    const response = await api.get(`${API_URL}autoClaveHistorial`);
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

const getOneAutoClave = async (id) => {
  try {
    const response = await api.get(`${API_URL}autoClave/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneProceso = async (id) => {
  try {
    const response = await api.get(`${API_URL}autoClaveProceso/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosAutoClave = async (datos) => {
  try {
    const response = await api.post('autoClave', datos);
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

export { getDatosAutoClave, getOneProceso, getAutoClavebyNumber, getDatosHistorial,getDatosLogDes, getDatosLog, PostDatosAutoClave, getOneAutoClave, getListTruckView };