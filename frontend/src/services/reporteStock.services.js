import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// const API_URL = getApiBaseUrl();
const API_URL = getApiBaseUrl();


// Crear una instancia de Axiosadd
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


const getReporteStock = async () => {
  try {
    const response = await api.get(`${API_URL}reporteStock`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getProblemaStock = async () => {
  try {
    const response = await api.get(`${API_URL}problemaStock`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getVistaStock = async () => {
  try {
    const response = await api.get(`${API_URL}vistaStock`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getStockview= async () => {
  try {
    const response = await api.get(`${API_URL}stockview`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getStock= async () => {
  try {
    const response = await api.get(`${API_URL}stock`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getStockV= async () => {
  try {
    const response = await api.get(`stockv`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};



const getOneDatos = async (serie) => {
  try {
    const response = await api.get(`${API_URL}reporteStock/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getOneProblema = async (serie) => {
  try {
    const response = await api.get(`${API_URL}reporteStock/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostReporteStock = async (datos) => {
  try {
    const response = await api.post(`${API_URL}reporteStock`, datos);
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

const PostSendGmail = async (datos) => {
  try {
    const response = await api.post(`${API_URL}sendGmail`, datos);
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

// const updateRegistro = async (id, data) => {
//   try {
//     const response = await api.put(`${API_URL}updateStock/${id}`, data);
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

const updateRegistro = async (id, data, producto) => {
  try {
    // Combinar el tercer parámetro `producto` con los datos existentes
    const payload = {
      ...data,
      producto, // Agregar el tercer parámetro al cuerpo de la solicitud
    };

    const response = await api.put(`${API_URL}updateStock/${id}`, payload);
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
    throw new Error("Error al obtener datos del backend");
  }
};



export { getStock, getStockV, getReporteStock, PostReporteStock, getProblemaStock, getVistaStock, getOneDatos, getOneProblema, getStockview, PostSendGmail, updateRegistro};
