// import io from 'socket.io-client';
// import { getListTruckView } from './truk.services';

// const SOCKET_URL = 'http://192.168.88.69:4000'; // URL del servidor Socket.IO
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ['websocket', 'polling'],
//   query: {
//     token: localStorage.getItem('authToken') // Pasar el token al conectarse
//   }
// });

// // Manejar la conexión
// socket.on('connect', () => {
//   console.log('Conectado al servidor de Socket.IO');
// });

// socket.on('disconnect', () => {
//   console.log('Desconectado del servidor de Socket.IO');
// });

// // Emitir un evento al servidor para solicitar datos
// // Emitir un evento al servidor para solicitar datos
// const requestListHangar2 = () => {
//   return new Promise((resolve, reject) => {
//     socket.emit('requestListHangar2');

//     socket.once('listHangar2ViewData', (response) => {
//       if (response.error) {
//         reject(new Error('Error al obtener datos del backend: ' + response.error));
//       } else {
//         resolve(response.data);
//       }
//     });

//     socket.on('connect_error', (error) => {
//       reject(new Error('Error de conexión con el servidor: ' + error.message));
//     });
//   });
// };




// // Emitir un evento para actualizar el estado del camión
// const updateTruckState = (truckId, newState) => {

//   return new Promise((resolve, reject) => {
//     socket.emit('updateTruckState', { truckId, newState });

//     socket.once('truckStateUpdated', (response) => {
//       if (response.error) {
//         reject(new Error('Error al actualizar el estado del camión: ' + response.error));
//       } else {
//         resolve(response);
//       }
//     });

//     socket.on('connect_error', (error) => {
//       reject(new Error('Error de conexión con el servidor: ' + error.message));
//     });
//   });
// };

// // Escuchar los eventos de actualización del estado de los camiones
// socket.on('truckStateUpdated', (updatedTruck) => {
// });

// export { requestListHangar2, updateTruckState};
