import axios from 'axios';
import getApiBaseUrl from '../utils/getApiBaseUrl';
// import API_True from '../utils/tools';

const API_URL = getApiBaseUrl();
console.log("🚀 ~ API_URL:", API_URL)
// const API_URL = API_True;
// const API_URL = getApiBaseUrl();


const getFrases = async () => {
  try {
    const response = await axios.get(`https://frasedeldia.azurewebsites.net/api/phrase`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const getOneDatos = async (id) => {
  try {
    const response = await axios.get(`${API_URL}garden/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos del backend:', error);
  }
};

const PostLogin = async (datos) => {
  console.log("🚀 ~ PostLogin ~ datos:", datos)
  try {
    const response = await axios.post(`${API_URL}login`, datos);
        return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Si el error es una respuesta del servidor con un mensaje de error
      throw new Error( error.response.data.message);
    } else {
      // Si el error no es una respuesta del servidor con un mensaje de error
      throw new Error('Error al enviar datos al backend: ' + error.message);
    }
  }
};

export { getFrases, PostLogin, getOneDatos };
