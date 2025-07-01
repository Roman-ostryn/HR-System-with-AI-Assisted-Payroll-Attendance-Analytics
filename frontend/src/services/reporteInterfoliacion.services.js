import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// const API_URL = getApiBaseUrl();
const API_URL = getApiBaseUrl();


const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const PostReporteInterfoliacion = async (datos) => {
  try {

    const response = await api.post(`${API_URL}reporteInterfoliacion`, datos);
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

const getVistaInterfoliacion = async () => {
  try {
    const response = await api.get(`${API_URL}vistainterfoliacion`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getReporte = async () => {
  try {
    const response = await api.get(`${API_URL}reporte`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getReporteInterfoliacion = async (fecha) => {
  try {
    const response = await api.post(`reporteInterfoliacion/fecha`, {fecha});

    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneDatos = async (serie) => {
  try {
    const response = await api.get(`${API_URL}getOneSerie/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostPdf = async (datos) => {
  try {
    const formData = new FormData();
    formData.append('file', datos.file); // Ajusta según tus datos
    // Agregar otros campos necesarios
    formData.append('field1', datos.field1);
    formData.append('field2', datos.field2);


    const response = await api.post('reportePdf', formData, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const errorBlob = await error.response.data;
      const errorText = await errorBlob.text();
      console.error('Datos de error del servidor:', errorText);
      throw new Error('Error al enviar datos al backend: ' + errorText);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};


const getReporteInterfolacion = async () => {
  try {
    const response = await api.get('reporteInterfolacion');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getVistaCalandra = async () => {
  try {
    const response = await api.get(`${API_URL}vistacalandra`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getProblemaCalandra = async () => {
  try {
    const response = await api.get('problemaCalandra');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getMotivoCalandra = async () => {
  try {
    const response = await api.get('motivoCalandra');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const PostReporteInterfolacion = async (datos) => {
  try {
    const response = await api.post(`${API_URL}reporteInterfoliacion`, datos);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error en la respuesta del servidor
      console.error('Error en el servidor:', error.response.data);
      throw new Error(`Error (${error.response.status}): ${error.response.data.message}`);
    } else {
      // Error de conexión o otro problema
      console.error('Error de red o general:', error.message);
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};


export { getReporteInterfolacion, getReporte, getReporteInterfoliacion, getVistaInterfoliacion, getOneDatos, PostReporteInterfoliacion, PostPdf, getVistaCalandra, getMotivoCalandra, PostReporteInterfolacion, getProblemaCalandra };