import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';
import getUrlSocket from '../utils/getUrlSocket';

import io from 'socket.io-client';
const SOCKET_URL = getUrlSocket(); // URL del servidor Socket.IO
// const API_URL = getApiBaseUrl();
const API_URL = getApiBaseUrl();
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

const api = axios.create({
  baseURL: API_URL,
});

socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de Socket.IO');
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

const getReporteCalandra = async () => {
  try {
    const response = await api.get('reporteCalandra');
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

const getOneDatos = async (serie) => {
  try {
    const response = await api.get(`${API_URL}getOneSerie/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostReporteCalandra = async (datos) => {
  try {
    const response = await api.post('reporteCalandra', datos);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Datos de error del servidor:', error.response.data); // Muestra la respuesta del servidor
      throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
    } else {
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

const updateRegistro = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}rpcalandra/${id}`, data);
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


const getOneProblemaCalandra = async (id) => {
  try {
    const response = await api.get(`${API_URL}problemaCalandra/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostReporteCalandraSK = (datos) => {
  return new Promise((resolve, reject) => {
    // Emitir evento para crear un reporte de lavadora con los datos
    socket.emit('PostReporteCalandraSK', { datos });

    // Escuchar la respuesta del servidor
    socket.once('calandraReportCreated', (response) => {
      if (response.error) {
        reject(new Error('Error al crear el reporte de calandra: ' + response.error));
      } else {
        resolve(response);
      }
    });

    // Manejo de errores de conexión
    socket.on('connect_error', (error) => {
      reject(new Error('Error de conexión con el servidor: ' + error.message));
    });
  });
};



export { getReporteCalandra,PostReporteCalandraSK, getOneProblemaCalandra, getOneDatos, PostPdf, getVistaCalandra, getMotivoCalandra, PostReporteCalandra, getProblemaCalandra, updateRegistro };