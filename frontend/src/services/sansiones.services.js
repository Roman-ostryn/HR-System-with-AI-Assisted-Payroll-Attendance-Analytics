import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
// const API_URL = getApiBaseUrl();
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

// const getDatosGrupos = async () => {
//   try {
//     const response = await api.get(`${API_URL}grupos`);
//     //  console.log("este es el verdadero", response.data)
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

const getAguinaldoIpsView = async () => {
  try {
    const response = await api.get('aginaldo/aguinaldoIpsView');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend: ' + error.message);
  }
};

const getPagosView = async () => {
  try {
    const response = await api.get('pagos/pagosView');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend: ' + error.message);
  }
};

const getOneGrupos = async (id) => {
  try {
    const response = await api.get(`${API_URL}grupos/${id}`);
    //  console.log("este es el verdadero", response.data)
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosPagos = async (datos) => {
  try {
    const response = await api.post('pagosSalario', datos);
    return response.data;

  } catch (error) {
    console.log("Error capturado en PostDatosPagos:", error); // Información adicional para depuración

    if (error.response) {
      // Error con respuesta del servidor
      console.log("Respuesta del servidor:", error.response);
      const mensajeError = error.response.data?.message || "Error desconocido del servidor";
      throw new Error(`Error al enviar datos al backend: ${mensajeError}`);
    } else if (error.request) {
      // El cliente envió la solicitud pero no recibió una respuesta
      console.log("Solicitud sin respuesta:", error.request);
      throw new Error("No se recibió respuesta del servidor. Por favor verifica tu conexión.");
    } else {
      // Otro tipo de error
      console.log("Otro tipo de error:", error.message);
      throw new Error(`Error inesperado: ${error.message}`);
    }
  }
};


export {  PostDatosPagos, getAguinaldoIpsView, getPagosView};