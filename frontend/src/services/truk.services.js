// import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';

// const API_URL = 'http://192.168.88.69:4000/';


// // Crear una instancia de Axios
// const api = axios.create({
//   baseURL: API_URL,
// });

// // Configurar un interceptor para agregar el token a cada solicitud
// api.interceptors.request.use(
//   (config) => {
//     // Obtener el token del localStorage
//     const token = localStorage.getItem('authToken');
    
//     if (token) {
//       // Agregar el token al encabezado de autorización
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// const getDatos = async () => {
//   try {
//     const response = await api.get(`${API_URL}truck`);
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
//     const response = await axios.get(`${API_URL}garden/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error al obtener datos del backend:', error);
//   }
// };

// const PostDatos = async (datos) => {
//   try {
//     const response = await axios.post(`${API_URL}garden`, datos);
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.data && error.response.data.message) {
//       // Si el error es una respuesta del servidor con un mensaje de error
//       throw new Error('Error al enviar datos al backend: ' + error.response.data.message);
//     } else {
//       // Si el error no es una respuesta del servidor con un mensaje de error
//       throw new Error('Error al enviar datos al backend: ' + error.message);
//     }
//   }
// };

// export { getDatos, PostDatos, getOneDatos, getListTruckView };
