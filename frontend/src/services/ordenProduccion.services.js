import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// URL base de la API
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

const getDatosOrdenProduccion = async () => {
  try {
    const response = await api.get(`${API_URL}ordenProduccion`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getDatosOrdenView = async () => {
  try {
    const response = await api.get(`${API_URL}ordenProduccionview`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getCaballeteView = async () => {
  try {
    const response = await api.get(`${API_URL}caballeteView`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getCaballeteView2 = async () => {
  try {
    const response = await api.get(`${API_URL}caballeteView2`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getDatosOrdenView2 = async () => {
  try {
    const response = await api.get(`${API_URL}ordenProduccionview2`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getUltimaOrden = async () => {
  try {
    const response = await api.get(`${API_URL}ultimaOrden`);
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

const getOneOrdenProduccion = async (id) => {
  try {
    const response = await api.get(`${API_URL}ordenProduccion/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneOrdenProduccionxd = async (id) => {
  try {
    const response = await api.get(`${API_URL}ordenProduccionxd/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOrdenSerie = async (orden) => {
  try {
    const response = await api.get(`${API_URL}ordenProduccionSeries/${orden}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getSerie = async (orden) => {
  try {
    const response = await api.get(`${API_URL}serie/${orden}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOrdenOne = async (orden) => {
  try {
    const response = await api.get(`${API_URL}ordenProduccionxd/${orden}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getSerieEtiqueta = async (serie) => {
  try {
    const response = await api.get(`${API_URL}getSerieEtiqueta/${serie}`);
    return response.data;
  } catch (error) {
    return error.response.status;
    // throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosOrdenProduccion = async (datos) => {
  try {
    const response = await api.post('ordenProduccion', datos);
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


const PutActualizarReservas = async (paquete, cantidad) => {
  try {
    const response = await api.put('ordenProduccion/reservas', { paquete, cantidad });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Si el error es una respuesta del servidor con un mensaje de error
      throw new Error('Error al actualizar reservas: ' + error.response.data.message);
    } else {
      // Si el error no es una respuesta del servidor con un mensaje de error
      throw new Error('Error al actualizar reservas: ' + error.message);
    }
  }
};


const getChapas = async (serie) => {
  try {
    const response = await api.get(`${API_URL}getOneChapas/${serie}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getVerificarStock = async (cod) => {
  try {
    const response = await api.get(`${API_URL}verificarStock/${cod}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


//   try {
//     const response = await api.get(`${API_URL}verificarStock/${cod}`);

//     // Si la respuesta contiene un mensaje, devolver el mensaje.
//     if (response.data.message) {
//       return response.data.message;
//     }

//     // Devolver los datos si existen.
//     return response.data.data;
//   } catch (error) {
//     console.error("Error al obtener datos del backend:", error);

//     // Devolver el mensaje del error si existe, o un mensaje genérico.
//     return error.response?.data?.message || "Error al obtener stock";
//   }
// };
const getOrdenOrden = async (orden) => {
  try {
    const response = await api.get(`${API_URL}ordenProduccionSeries/${orden}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


// const getTemperatura = async () => {
//   try {
//     // Asegúrate de que la temperatura se pase como parámetro en la URL

//     const response = await api.get(`${API_URL}temperatura`);

//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
const getTemperatura = () => {
  const eventSource = new EventSource(`${API_URL}temperatura/sse`, {
    withCredentials: true,  // Asegura que las cookies se envíen con la solicitud
  });
  return eventSource;
};

const putDatos = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}actualizarNS/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};


export {putDatos, getTemperatura, getSerieEtiqueta, getCaballeteView, getOrdenOne,getOneOrdenProduccionxd,getSerie, getOrdenSerie, PutActualizarReservas, getVerificarStock, getDatosOrdenProduccion, getDatosOrdenView2, getDatosOrdenView, PostDatosOrdenProduccion, getOneOrdenProduccion, getCaballeteView2, getListTruckView, getUltimaOrden, getOrdenOrden, getChapas };