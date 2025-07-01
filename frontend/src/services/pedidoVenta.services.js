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

const getDatosPedidoVenta = async () => {
  try {
    const response = await api.get(`${API_URL}pedidoVenta`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getDatosHistorial = async () => {
  try {
    const response = await api.get(`${API_URL}pedidoVenta/historial`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getLiberarFinanciero = async () => {
  try {
    const response = await api.get(`${API_URL}pedidoVentaLiberar`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getLiberarCamiones = async () => {
  try {
    const response = await api.get(`${API_URL}liberarCamiones`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getCargamento = async () => {
  try {
    const response = await api.get(`${API_URL}cargamento`);
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

const getOnePedidoVenta = async (id) => {
  try {
    const response = await api.get(`${API_URL}pedidoVenta/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneChapas = async (id) => {
  try {
    const response = await api.get(`${API_URL}camionChapas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneChapasColar = async (colar) => {
  try {
    const response = await api.get(`${API_URL}getOneColar/${colar}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneChapasHistorial = async (id) => {
  try {
    const response = await api.get(`${API_URL}camionChapas/historial/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOnePedido = async (id) => {
  try {
    const response = await api.get(`${API_URL}Pedido/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getOneProducto = async (colar, serie) => {
  try {
    const response = await api.get(`${API_URL}productoInterfoliacion/${colar}/${serie}`);
    return response.data[0];
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneCamion = async (chapa) => {
  try {
    const response = await api.get(`${API_URL}camionCarga/${chapa}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};


const getOneCamionHistorial = async (chapa) => {
  try {
    const response = await api.get(`${API_URL}camionCargaHistorial/${chapa}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostDatosPedidoVenta = async (datos) => {
  try {
    const response = await api.post('pedidoVenta', datos);
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

const PostCargaPedido= async (datos) => {
  try {
    const response = await api.post('cargaPedido', datos);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Si el error es una respuesta del servidor con un mensaje de error
      throw new Error(' ' + error.response.data.message);
    } else {
      // Si el error no es una respuesta del servidor con un mensaje de error
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

const putDatos = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}pedidoVenta/${id}`, data);

    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

const putDatosLiberacion = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}pedidoVentaLiberacion/${id}`, data);

    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

const putCamionesPedidos = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}camiones/${id}`, data);

    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

const updateVentaStock = async (id, data) => {
  try {
    const response = await api.put(`ventaStock/${id}`, data);

    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

const updateSalidaStock = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}salidaStock/${id}`, data);

    return response.data;
  } catch (error) {
    throw new Error('Error al Actualizar los Datos: ');
  }
};

export { getDatosPedidoVenta, putDatosLiberacion, getOnePedido, getOneChapasColar, getOneChapasHistorial, getOneCamionHistorial, getOneProducto, updateSalidaStock, updateVentaStock, putCamionesPedidos, getOneChapas, getOneCamion, getLiberarCamiones, PostCargaPedido, getCargamento, putDatos, getLiberarFinanciero, PostDatosPedidoVenta, getOnePedidoVenta, getListTruckView, getDatosHistorial };