import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';
import getUrlSocket from '../utils/getUrlSocket';

import io from 'socket.io-client';

// const API_URL = getApiBaseUrl();
const API_URL = getApiBaseUrl();
const SOCKET_URL = getUrlSocket(); 
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de Socket.IO');
});


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


const getReporteSalaLimpia = async () => {
  try {
    const response = await api.get(`${API_URL}reporteSalaLimpia`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getProblemaSalaLimpia = async () => {
  try {
    const response = await api.get(`${API_URL}problemaSalaLimpia`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getVistaSalaLimpia = async () => {
  try {
    const response = await api.get(`${API_URL}vistasalalimpia`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


// const getOneAutoClave = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}autoclave/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

// const getMarcacionesView = async () => {
//   try {
//     const response = await api.get(`${API_URL}marcacion/MarcacionView `);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

// const getListTruckView = async () => {
//   try {
//     const response = await api.get('truck/listTruckView');
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend: ' + error.message);
//   }
// };

// const getOneDatos = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}horasextras/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

const PostReporteSalaLimpia = async (datos) => {
  try {

    const response = await api.post(`${API_URL}reporteSalaLimpia`, datos);
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

const PostReporteSalaLimpiaSK = (datos) => {
  return new Promise((resolve, reject) => {
    // Emitir evento para crear un reporte de lavadora con los datos
    socket.emit('PostReporteSalaLimpiaSK', { datos });

    // Escuchar la respuesta del servidor
    socket.once('salaLimpiaReportCreated', (response) => {
      if (response.error) {
        reject(new Error('Error al crear el reporte de Sala Limpia: ' + response.error));
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



const UpdateReporteSalaLimpiaTSL = (id, datos) => {

  
  return new Promise((resolve, reject) => {
    // Emitir evento para actualizar un reporte de Sala Limpia con los datos
    socket.emit('UpdateReporteSalaLimpiaSK', { id, datos });
    
    // Escuchar la respuesta del servidor
    socket.once('salaLimpiaReportUpdated', (response) => {
      if (response && response.error) {
        reject(new Error('Error al actualizar el reporte de Sala Limpia: ' + response.error));
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


const updateRegistro = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}rpsalalimpia/${id}`, data);
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



const UpdateReporteSalaLimpiaSK = (id, datos) => {

  
  return new Promise((resolve, reject) => {
    // Emitir evento para actualizar un reporte de Sala Limpia con los datos
    socket.emit('UpdateReporteSalaLimpiaSK', { id, datos });
    
    // Escuchar la respuesta del servidor
    socket.once('salaLimpiaReportUpdated', (response) => {
      if (response && response.error) {
        reject(new Error('Error al actualizar el reporte de Sala Limpia: ' + response.error));
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
export { getReporteSalaLimpia, updateRegistro, UpdateReporteSalaLimpiaSK,PostReporteSalaLimpiaSK,  PostReporteSalaLimpia, getProblemaSalaLimpia, getVistaSalaLimpia};