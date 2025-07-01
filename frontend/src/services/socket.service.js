// import io from 'socket.io-client';

// // Función para crear una instancia de Socket.IO con el token
// export const createSocket = () => {
//   const token = localStorage.getItem('authToken'); // Obtén el token del localStorage

//   return io('http://192.168.88.69:5004', {
//     withCredentials: true,
//     transports: ['websocket', 'polling'],
//     query: {
//       token
//     }
//   });
// };

// // Puedes agregar funciones para manejar eventos o emitir eventos si es necesario
// const socket = createSocket();

// export const requestListHangar2 = () => {
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

// export const updateTruckState = (truckId, newState) => {
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

// export default socket;
