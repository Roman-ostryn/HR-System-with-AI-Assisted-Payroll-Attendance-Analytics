import io from 'socket.io-client';
import getUrlSocket from '../utils/getUrlSocket';

// import { getListTruckView } from './truk.services';
// import Alert from '@mui/material/Alert';
const SOCKET_URL = getUrlSocket(); // URL del servidor Socket.IO
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  query: {
    token: localStorage.getItem('authToken') // Pasar el token al conectarse
  }
});

// Manejar la conexión
socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de Socket.IO');
}); 

// Emitir un evento al servidor para solicitar datos
const getProduccionView = () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('El servidor no respondió a tiempo.'));
    }, 10000); // 10 segundos

    socket.emit('VistaProduccion');

    socket.once('VistaProduccionData', (response) => {
      clearTimeout(timeout);
      if (response.error) {
        reject(new Error('Error al obtener datos del backend: ' + response.error));
      } else {
        resolve(response.data);
      }
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      reject(new Error('Error de conexión con el servidor: ' + error.message));
    });
  });
};

// Emitir un evento para actualizar el estado del camión
const createTruckState = (newData) => {

  return new Promise((resolve, reject) => {
    socket.emit('createTruckState', { newData });

    socket.once('truckStateCreated', (response) => {
      if (response.error) {
        reject(new Error('Error al crear el estado del camión: ' + response.error));
      } else {
        resolve(response);
      }
    });

    socket.on('connect_error', (error) => {
      reject(new Error('Error de conexión con el servidor: ' + error.message));
    });
  });
};


// Emitir un evento para actualizar el estado del camión
const updateLavadora = (Id, dataxd) => {

  return new Promise((resolve, reject) => {
    socket.emit('updateProduccion', { Id, dataxd });

    socket.once('ProduccionUpdated', (response) => {
      if (response.error) {
        reject(new Error('El Paquete no Existe O ' + response.error));
      } else {
        resolve(response);
      }
    });

    socket.on('connect_error', (error) => {
      reject(new Error('Error de conexión con el servidor: ' + error.message));
    });
  });
};

// Emitir un evento para actualizar el estado del camión
const deleteTruckState = (truckId, newState) => {

  return new Promise((resolve, reject) => {
    socket.emit('updateTruckState', { truckId, newState });

    socket.once('deleteTruck', (response) => {
      if (response.error) {
        reject(new Error('Error al actualizar el estado del camión: ' + response.error));
      } else {
        resolve(response);

        
      }
    });

    socket.on('connect_error', (error) => {
      reject(new Error('Error de conexión con el servidor: ' + error.message));
    });
  });
};
// Escuchar los eventos de actualización del estado de los camiones
  socket.on('truckStateUpdated', (updatedTruck) => {
  // Puedes manejar la actualización de la UI aquí si lo prefieres
});

export { getProduccionView, updateLavadora, deleteTruckState, createTruckState};
