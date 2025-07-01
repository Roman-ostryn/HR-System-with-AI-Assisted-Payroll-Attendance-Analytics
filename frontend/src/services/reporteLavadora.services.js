import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';
import io from 'socket.io-client';
import getUrlSocket from '../utils/getUrlSocket';


const API_URL = getApiBaseUrl();

const SOCKET_URL = getUrlSocket(); // URL del servidor Socket.IO
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_URL,
});
socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de Socket.IO');
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

const getVistaLavadoraSL = async () => {
  try {
    const response = await api.get(`${API_URL}vistaLavadoraSL`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getReporteLavadora = async () => {
  try {
    const response = await api.get(`${API_URL}reporteLavadora`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getVistaLavadora = async () => {
  try {
    const response = await api.get(`${API_URL}vistalavadora`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getProblemaLavadora = async () => {
  try {
    const response = await api.get(`${API_URL}problemaLavadora`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


// const getOneAutoClave = async (id) => {
//   try {
//     const response = await api.get(`${API_URL}autoclave/${id}`);
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
//     const response = await api.get(`${API_URL}horasextras/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

const PostReporteLavadora = (datos) => {
  return new Promise((resolve, reject) => {
    // Emitir evento para crear un reporte de lavadora con los datos
    socket.emit('PostReporteLavadora', { datos });

    // Escuchar la respuesta del servidor
    socket.once('lavadoraReportCreated', (response) => {
      if (response.error) {
        reject(new Error('Error al crear el reporte de lavadora: ' + response.error));
      } else {
        resolve(response);
      }
    });

    // Manejo de errores de conexión
    socket.on('connect_error', (error) => {
      reject(new Error('Error de conexión con el servidor: ' + error.message));
    });
  })};
// const PostReporteLavadora = (datos) => {
//   return new Promise((resolve, reject) => {
//     // Emitir evento para crear un reporte de lavadora con los datos
//     socket.emit('PostReporteLavadora', { datos });

//     // Escuchar la respuesta del servidor
//     socket.once('lavadoraReportCreated', (response) => {
//       if (response.error) {
//         reject(new Error('Error al crear el reporte de lavadora: ' + response.error));
//       } else {
//         resolve(response);
//       }
//     });

//     // Manejo de errores de conexión
//     socket.on('connect_error', (error) => {
//       reject(new Error('Error de conexión con el servidor: ' + error.message));
//     });
//   });
// };
// const updateHorasExtras = async (id, data) => {
//   try {
//     const response = await api.put(`${API_URL}horasExtras/${id}`, data);
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // El servidor respondió con un código de error
//       console.error("Estado del error:", error.response.status); // Estado del error (e.g., 404, 500)
//       console.error("Datos del error:", error.response.data); // Datos del error devueltos por el servidor
//     } else if (error.request) {
//       // No se recibió respuesta
//       console.error("No se recibió respuesta del servidor:", error.request);
//     } else {
//       // Error al configurar la solicitud
//       console.error("Error en la solicitud:", error.message);
//     }
//     throw new Error('Error al obtener datos del backend');
//   }
// };
// const getVistaLavadoraSL = async () => {
//   try {
//     const response = await api.get(`${API_URL}vistaLavadoraSL`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

const getOneReporteLavadora = async (id) => {
  try {
    const response = await api.get(`${API_URL}reporteLavadora/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

export { getReporteLavadora, PostReporteLavadora, getProblemaLavadora, getVistaLavadora, getVistaLavadoraSL, getOneReporteLavadora};